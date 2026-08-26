// src/services/aiSiteGenerator.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class AISiteGenerator {
  async generateSiteFromLead(leadId) {
    try {
      // Get lead data
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      });

      if (!lead) throw new Error('Lead not found');

      // Generate business profile with AI
      const businessProfile = await this.generateBusinessProfile(lead);
      
      // Generate HTML/CSS for one-page site
      const siteHtml = await this.generateOnePageSite(businessProfile);
      
      // Save generated site
      const document = await prisma.document.create({
        data: {
          title: `${lead.name} - One Page Site`,
          description: `AI-generated one-page website for ${lead.name}`,
          fileUrl: `https://dapc.co.ke/sites/${lead.id}.html`,
          fileType: 'text/html',
          fileSize: Buffer.byteLength(siteHtml, 'utf8'),
          ownerId: lead.userId || 'default-owner',
          folder: 'ai-generated-sites',
          tags: ['ai-generated', 'one-page', 'prospect'],
          isPublic: true
        }
      });

      // Store the HTML content (you'd typically upload to cloud storage)
      await this.storeSiteHtml(lead.id, siteHtml);

      // Update lead status
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'site_generated' }
      });

      return {
        success: true,
        siteUrl: document.fileUrl,
        leadId: lead.id,
        businessName: lead.name
      };

    } catch (error) {
      console.error('AI Site Generation Error:', error);
      throw error;
    }
  }

  async generateBusinessProfile(lead) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Create a detailed business profile for ${lead.name} located at ${lead.address}.
      The business is in the automotive/garage industry.
      
      Generate:
      1. Business description (50-80 words)
      2. 5 key services they offer
      3. 3 unique selling points
      4. Suggested business hours (9am-6pm Mon-Sat)
      5. A tagline for their business
      
      Format as JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
  }

  async generateOnePageSite(profile) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Generate a complete, professional, mobile-responsive HTML/CSS one-page website for a business with the following details:
      
      Business Name: ${profile.businessName || 'Auto Care Garage'}
      Tagline: ${profile.tagline || 'Quality Service You Can Trust'}
      Description: ${profile.description || 'Professional automotive services'}
      Services: ${profile.services ? profile.services.join(', ') : 'General repairs, Diagnostics, Tire services'}
      Unique Selling Points: ${profile.usp ? profile.usp.join(', ') : 'Professional team, Quality parts, Fast service'}
      Hours: ${profile.hours || 'Mon-Sat 9am-6pm'}
      Address: ${profile.address || 'Nairobi, Kenya'}
      Phone: ${profile.phone || '+254 700 000 000'}
      
      Requirements:
      - Modern, clean design with a color scheme suitable for automotive business
      - Mobile-responsive (use CSS flex/grid)
      - Include sections: Hero (with business name, tagline, CTA), Services, About, Contact
      - Contact form (just HTML structure)
      - Google Maps placeholder (use iframe with coordinates)
      - Professional typography
      - Use only HTML and inline CSS (no external dependencies except Google Fonts)
      - Include a "Claim This Listing" CTA button
      
      Return ONLY the complete HTML code with embedded CSS.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let html = response.text();
    
    // Clean up markdown code blocks if present
    html = html.replace(/```html/g, '').replace(/```/g, '').trim();
    
    // Inject business-specific data
    html = html.replace(/\[BUSINESS_NAME\]/g, profile.businessName);
    html = html.replace(/\[ADDRESS\]/g, profile.address);
    html = html.replace(/\[PHONE\]/g, profile.phone);
    
    return html;
  }

  async storeSiteHtml(leadId, html) {
    // In production, upload to S3 or similar
    // For now, store in filesystem or database
    const fs = require('fs');
    const path = require('path');
    
    const siteDir = path.join(process.cwd(), 'public', 'sites');
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(siteDir, `${leadId}.html`),
      html
    );
  }

  async generateAndAttachToLead(leadId) {
    try {
      // Generate full site
      const siteData = await this.generateSiteFromLead(leadId);
      
      // Create a shareable link
      const shareableLink = `https://dapc.co.ke/sites/${leadId}`;
      
      // Log for tracking
      console.log(`✅ Site generated for ${siteData.businessName}`);
      console.log(`🔗 Preview: ${shareableLink}`);
      
      return {
        ...siteData,
        previewLink: shareableLink
      };
    } catch (error) {
      console.error('Failed to generate site:', error);
      throw error;
    }
  }
}