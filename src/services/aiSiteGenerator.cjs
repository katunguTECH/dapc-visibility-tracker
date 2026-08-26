// src/services/aiSiteGenerator.cjs
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const prisma = new PrismaClient();

class AISiteGenerator {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
    this.ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'tinyllama';
    console.log(`🤖 Using AI Provider: ${this.provider}`);
    console.log(`📦 Model: ${this.ollamaModel}`);
    console.log(`💾 Storage: ${process.env.AI_SITES_STORAGE || 'local'}`);
  }

  async getDefaultUser() {
    try {
      // Try to find an existing user
      let user = await prisma.user.findFirst({
        where: { clerkId: 'default-clerk-id' }
      });

      if (!user) {
        // Create a default user if none exists
        user = await prisma.user.create({
          data: {
            clerkId: 'default-clerk-id',
            email: 'default@dapc.co.ke',
            name: 'Default User',
            hasPaid: false,
            plan: 'Free'
          }
        });
        console.log("✅ Created default user:", user.id);
      }
      return user;
    } catch (error) {
      console.error("Error getting default user:", error.message);
      throw error;
    }
  }

  async generateWithOllama(prompt) {
    try {
      const response = await axios.post(
        this.ollamaUrl,
        {
          model: this.ollamaModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 500
          }
        },
        {
          timeout: 120000
        }
      );
      
      return response.data.response || '';
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log("❌ Ollama is not running. Please start Ollama from your Start Menu.");
        throw new Error('Ollama service not available');
      }
      console.error('Ollama error:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateBusinessProfile(lead) {
    try {
      const prompt = `
        Create a detailed business profile for a garage/auto repair business in Kenya.
        
        Business Name: ${lead.name}
        Location: ${lead.address}
        Phone: ${lead.phone || '+254 700 000 000'}
        
        Generate a JSON object with these fields:
        {
          "description": "Professional business description (50-80 words)",
          "services": ["service1", "service2", "service3", "service4", "service5"],
          "usp": ["unique point 1", "unique point 2", "unique point 3"],
          "hours": "Mon-Sat 8am-6pm",
          "tagline": "Catchy tagline (5-7 words)"
        }
        
        Return ONLY the JSON object, no additional text.
      `;

      const text = await this.generateWithOllama(prompt);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating business profile:', error);
      throw error;
    }
  }

  async generateOnePageSite(profile) {
    try {
      const prompt = `
        Generate a complete, professional, mobile-responsive HTML/CSS one-page website for a garage/auto repair business in Kenya.
        
        Business Details:
        - Name: ${profile.businessName || 'Auto Care Garage'}
        - Tagline: ${profile.tagline || 'Quality Service You Can Trust'}
        - Description: ${profile.description || 'Professional automotive services'}
        - Services: ${profile.services ? profile.services.join(', ') : 'General repairs, Diagnostics, Tire services'}
        - Unique Selling Points: ${profile.usp ? profile.usp.join(', ') : 'Professional team, Quality parts, Fast service'}
        - Hours: ${profile.hours || 'Mon-Sat 8am-6pm'}
        - Address: ${profile.address || 'Nairobi, Kenya'}
        - Phone: ${profile.phone || '+254 700 000 000'}
        
        Design Requirements:
        - Modern, clean design with a color scheme suitable for an auto garage
        - Mobile-responsive (use CSS flexbox/grid)
        - Include sections: Hero, Services, About, Contact
        - Include a contact form (HTML structure only)
        - Include a Google Maps placeholder
        - Professional typography
        - Use inline CSS (no external dependencies except Google Fonts)
        - Include a "Claim This Listing" button
        - Include WhatsApp link using "https://wa.me/${profile.phone.replace(/\D/g, '')}"
        
        Return ONLY the complete HTML code with embedded CSS.
      `;

      let html = await this.generateWithOllama(prompt);
      html = html.replace(/```html/g, '').replace(/```/g, '').trim();
      html = html.replace(/\[BUSINESS_NAME\]/g, profile.businessName || 'Auto Care Garage');
      html = html.replace(/\[ADDRESS\]/g, profile.address || 'Nairobi, Kenya');
      html = html.replace(/\[PHONE\]/g, profile.phone || '+254 700 000 000');
      
      return html;
    } catch (error) {
      console.error('Error generating site HTML:', error);
      throw error;
    }
  }

  async storeSiteHtml(leadId, html) {
    const filename = `${leadId}.html`;
    
    const siteDir = path.join(process.cwd(), 'public', 'sites');
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
    }

    const localPath = path.join(siteDir, filename);
    fs.writeFileSync(localPath, html);
    
    const localUrl = `/sites/${filename}`;
    console.log(`✅ Site saved locally: ${localUrl}`);
    
    return {
      fileUrl: localUrl,
      path: localPath,
      publicUrl: `http://localhost:3000${localUrl}`,
    };
  }

  async generateAndAttachToLead(leadId) {
    try {
      // Get or create default user
      const defaultUser = await this.getDefaultUser();
      
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      });

      if (!lead) throw new Error('Lead not found');

      console.log("📝 Generating business profile...");
      const profile = await this.generateBusinessProfile(lead);
      console.log("✅ Business profile generated");
      
      console.log("🌐 Generating website HTML...");
      const html = await this.generateOnePageSite({
        businessName: lead.name,
        address: lead.address,
        phone: lead.phone,
        ...profile
      });
      console.log("✅ Website HTML generated");

      console.log("💾 Saving HTML file...");
      const storageResult = await this.storeSiteHtml(leadId, html);

      console.log("📝 Saving to database...");
      const document = await prisma.document.create({
        data: {
          title: `${lead.name} - One Page Site`,
          description: profile.description || `AI-generated website for ${lead.name}`,
          fileUrl: storageResult.publicUrl,
          fileType: 'text/html',
          fileSize: Buffer.byteLength(html, 'utf8'),
          ownerId: defaultUser.id,
          folder: 'ai-generated-sites',
          tags: ['ai-generated', 'one-page', 'prospect'],
          isPublic: true,
        }
      });

      await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'site_generated' }
      });

      return {
        success: true,
        siteUrl: storageResult.publicUrl,
        leadId: lead.id,
        businessName: lead.name,
        documentId: document.id,
      };

    } catch (error) {
      console.error('AI Site Generation Error:', error);
      throw error;
    }
  }
}

module.exports = { AISiteGenerator };
