// src/services/aiSiteGenerator.cjs
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

class AISiteGenerator {
  constructor() {
    // Groq AI Configuration
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

    // Supabase Storage Configuration
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.storageBucket = process.env.AI_SITES_BUCKET || 'sites';

    if (!this.groqApiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }

    if (!this.supabaseUrl || !this.supabaseServiceKey) {
      throw new Error('Supabase storage is not configured');
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseServiceKey);

    console.log(`🤖 Using AI Provider: Groq (${this.groqModel})`);
    console.log(`💾 Storage: Supabase (${this.storageBucket})`);
  }

  async getDefaultUser() {
    try {
      let user = await prisma.user.findFirst({
        where: { clerkId: 'default-clerk-id' }
      });

      if (!user) {
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

  async generateWithGroq(prompt) {
    try {
      const response = await axios.post(
        this.groqUrl,
        {
          model: this.groqModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );
      return response.data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq error:', error.response?.data || error.message);
      throw new Error('AI generation failed: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  async generateBusinessProfile(lead) {
    try {
      const phone = lead.phone || '+254 700 000 000';
      const prompt = `
        Create a detailed business profile for a garage/auto repair business in Kenya.

        Business Name: ${lead.name}
        Location: ${lead.address}
        Phone: ${phone}

        Generate a JSON object with these fields:
        {
          "description": "Professional business description (50-80 words)",
          "services": ["service1", "service2", "service3", "service4", "service5"],
          "usp": ["unique point 1", "unique point 2", "unique point 3"],
          "hours": "Mon-Sat 8am-6pm",
          "tagline": "Catchy tagline (5-7 words)"
        }

        Return ONLY the JSON object, no additional text, no markdown code fences.
      `;

      const text = await this.generateWithGroq(prompt);
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
      const phone = profile.phone || '+254 700 000 000';
      const whatsappNumber = phone.replace(/\D/g, '');

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
        - Phone: ${phone}

        Design Requirements:
        - Modern, clean design with a color scheme suitable for an auto garage
        - Mobile-responsive (use CSS flexbox/grid)
        - Include sections: Hero, Services, About, Contact
        - Include a contact form (HTML structure only)
        - Include a Google Maps placeholder
        - Professional typography
        - Use inline CSS (no external dependencies except Google Fonts)
        - Include a "Claim This Listing" button
        - Include WhatsApp link using "https://wa.me/${whatsappNumber}"

        Return ONLY the complete HTML code with embedded CSS, no markdown code fences.
      `;

      let html = await this.generateWithGroq(prompt);
      html = html.replace(/```html/g, '').replace(/```/g, '').trim();
      html = html.replace(/\[BUSINESS_NAME\]/g, profile.businessName || 'Auto Care Garage');
      html = html.replace(/\[ADDRESS\]/g, profile.address || 'Nairobi, Kenya');
      html = html.replace(/\[PHONE\]/g, phone);

      return html;
    } catch (error) {
      console.error('Error generating site HTML:', error);
      throw error;
    }
  }

  async storeSiteHtml(leadId, html) {
    const filename = `${leadId}.html`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.storageBucket)
      .upload(filename, html, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      throw new Error('Failed to upload site to storage: ' + uploadError.message);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.storageBucket)
      .getPublicUrl(filename);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`✅ Site uploaded to Supabase: ${publicUrl}`);

    return { publicUrl };
  }

  async generateAndAttachToLead(leadId) {
    try {
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

      console.log("💾 Uploading HTML to storage...");
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



