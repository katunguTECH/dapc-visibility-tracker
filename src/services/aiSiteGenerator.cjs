// src/services/aiSiteGenerator.cjs
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

class AISiteGenerator {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.groqModel = process.env.GROQ_MODEL || 'qwen/qwen3.6-27b';
    this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

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

  cleanResponse(text) {
    let cleaned = text.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
    cleaned = cleaned.trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    return match ? match[0] : cleaned;
  }

  getFallbackHTML(profile) {
    const phone = profile.phone || '+254 700 000 000';
    const whatsappNumber = phone.replace(/\D/g, '');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.businessName || 'Auto Care Garage'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fa; color: #1a1a2e; }
    .hero { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 3rem; font-weight: 900; margin-bottom: 10px; }
    .hero p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 20px; }
    .btn { display: inline-block; background: #d42020; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    section { padding: 60px 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .card h3 { margin-bottom: 10px; }
    .footer { background: #1a1a2e; color: white; text-align: center; padding: 30px; }
    @media (max-width: 768px) { .hero h1 { font-size: 2rem; } }
  </style>
</head>
<body>
  <div class="hero">
    <div class="container">
      <h1>${profile.businessName || 'Auto Care Garage'}</h1>
      <p>${profile.tagline || 'Quality Service You Can Trust'}</p>
      <a href="https://wa.me/${whatsappNumber}" class="btn">📱 WhatsApp Us</a>
    </div>
  </div>
  <div class="container">
    <section>
      <h2>About Us</h2>
      <p>${profile.description || 'Professional auto repair services in Kenya.'}</p>
    </section>
    <section>
      <h2>Our Services</h2>
      <div class="grid">
        ${(profile.services || ['General Repairs', 'Diagnostics', 'Tire Services']).map(s => `<div class="card"><h3>${s}</h3></div>`).join('')}
      </div>
    </section>
    <section>
      <h2>Contact Us</h2>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${profile.address || 'Nairobi, Kenya'}</p>
      <a href="https://wa.me/${whatsappNumber}" style="display:inline-block;background:#25D366;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;margin-top:10px;">Chat on WhatsApp</a>
    </section>
  </div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} ${profile.businessName || 'Auto Care Garage'}</p>
  </div>
</body>
</html>`;
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
          temperature: 0.3,
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
        IMPORTANT: Return ONLY valid JSON. No XML tags, no markdown, no explanations.

        Create a JSON object for a garage/auto repair business in Kenya with these exact fields:
        {
          "description": "Professional business description (50-80 words)",
          "services": ["service1", "service2", "service3", "service4", "service5"],
          "usp": ["unique point 1", "unique point 2", "unique point 3"],
          "hours": "Mon-Sat 8am-6pm",
          "tagline": "Catchy tagline (5-7 words)"
        }

        Business Name: ${lead.name}
        Location: ${lead.address}
        Phone: ${phone}

        Return ONLY the JSON object with no additional text.
      `;

      const text = await this.generateWithGroq(prompt);
      const cleanedText = this.cleanResponse(text);

      try {
        return JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse JSON, using fallback');
        return {
          description: `${lead.name} is a professional auto repair garage located in ${lead.address}. We offer quality automotive services with experienced mechanics and modern equipment.`,
          services: ["General Repairs", "Diagnostics", "Tire Services", "Oil Changes", "Brake Services"],
          usp: ["Experienced Mechanics", "Quality Parts", "Fast Service"],
          hours: "Mon-Sat 8am-6pm",
          tagline: "Quality Service You Can Trust"
        };
      }
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

        Return ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>. No explanations, no thinking tags, no markdown code fences.
      `;

      let html = await this.generateWithGroq(prompt);

      // Remove think tags and markdown
      html = html.replace(/<think>[\s\S]*?<\/think>/gi, '');
      html = html.replace(/```html/g, '').replace(/```/g, '').trim();

      // Find the start of HTML
      const htmlStart = html.search(/<!DOCTYPE html>/i);
      if (htmlStart > -1) {
        html = html.substring(htmlStart);
      }

      // Find the end of HTML
      const htmlEnd = html.search(/<\/html>/i);
      if (htmlEnd > -1) {
        html = html.substring(0, htmlEnd + 7);
      }

      // Replace placeholders
      html = html.replace(/\[BUSINESS_NAME\]/g, profile.businessName || 'Auto Care Garage');
      html = html.replace(/\[ADDRESS\]/g, profile.address || 'Nairobi, Kenya');
      html = html.replace(/\[PHONE\]/g, phone);

      // If HTML is empty or too short, use fallback
      if (!html || html.length < 100) {
        console.log('⚠️ Generated HTML too short, using fallback template');
        return this.getFallbackHTML(profile);
      }

      return html;
    } catch (error) {
      console.error('Error generating site HTML:', error);
      return this.getFallbackHTML(profile);
    }
  }

  async storeSiteHtml(leadId, html) {
    const filename = `${leadId}.html`;

    // Clean the HTML
    let cleanHtml = html;

    // Remove think tags
    cleanHtml = cleanHtml.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleanHtml = cleanHtml.replace(/```html/g, '').replace(/```/g, '').trim();

    // Ensure it starts with DOCTYPE
    const doctypeIndex = cleanHtml.search(/<!DOCTYPE html>/i);
    if (doctypeIndex > -1) {
      cleanHtml = cleanHtml.substring(doctypeIndex);
    }

    // Ensure it ends with </html>
    const htmlEndIndex = cleanHtml.search(/<\/html>/i);
    if (htmlEndIndex > -1) {
      cleanHtml = cleanHtml.substring(0, htmlEndIndex + 7);
    }

    // Upload to Supabase with explicit content type
    const { error: uploadError } = await this.supabase.storage
      .from(this.storageBucket)
      .upload(filename, cleanHtml, {
        contentType: 'text/html; charset=utf-8',
        cacheControl: '3600',
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
