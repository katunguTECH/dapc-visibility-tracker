// src/components/LeadManager.jsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function LeadManager() {
  const { user } = useUser();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState({});
  const [findingEmail, setFindingEmail] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSite = async (leadId) => {
    setGenerating(prev => ({ ...prev, [leadId]: true }));
    try {
      const response = await fetch(`/api/leads/${leadId}/generate-site`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: 'site_generated', siteUrl: data.data.previewLink }
            : lead
        ));
        alert(`✅ Site generated for ${data.data.businessName}!`);
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate site');
    } finally {
      setGenerating(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const batchGenerate = async () => {
    const ungeneratedLeads = leads.filter(l => l.status !== 'site_generated');
    if (ungeneratedLeads.length === 0) {
      alert('All leads already have sites!');
      return;
    }

    if (!confirm(`Generate sites for ${ungeneratedLeads.length} leads?`)) {
      return;
    }

    const leadIds = ungeneratedLeads.map(l => l.id);
    setLoading(true);

    try {
      const response = await fetch('/api/leads/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds })
      });
      const data = await response.json();
      
      alert(`✅ ${data.succeeded} sites generated, ${data.failed} failed`);
      fetchLeads();
    } catch (error) {
      console.error('Batch generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const findEmail = async (leadId) => {
    if (findingEmail[leadId]) return;
    setFindingEmail(prev => ({ ...prev, [leadId]: true }));

    try {
      const response = await fetch(`/api/leads/${leadId}/find-email`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          alert(`✅ Email found: ${data.email}`);
          setLeads(prev => prev.map(l => 
            l.id === leadId 
              ? { ...l, email: data.email, status: 'email_found' }
              : l
          ));
          fetchLeads();
        } else {
          alert('❌ No email found for this business');
        }
      } else {
        alert(`❌ Failed to find email: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error finding email:', error);
      alert('❌ Failed to find email');
    } finally {
      setFindingEmail(prev => ({ ...prev, [leadId]: false }));
    }
  };

  // --- WhatsApp Helper Functions ---
  
  // Format phone number for WhatsApp
  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('254') && !cleaned.startsWith('+')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  // Get site URL for the lead
  const getSiteUrl = (lead) => {
    if (lead.siteUrl) return lead.siteUrl;
    if (lead.status === 'site_generated') {
      return `${window.location.origin}/sites/${lead.id}`;
    }
    return null;
  };

  // Generate WhatsApp link with personalized message
  const getWhatsAppLink = (lead) => {
    const phone = formatPhoneNumber(lead.phone);
    if (!phone) return null;

    const name = lead.name || 'there';
    const siteUrl = getSiteUrl(lead);
    const hasSite = lead.status === 'site_generated' || lead.siteUrl;

    // Create the message (exactly like the email)
    let message = `Hi ${name}\n\n`;
    message += `We built a free website preview for ${name} to show you what's possible.\n\n`;
    
    if (hasSite && siteUrl) {
      message += `View Your Free Preview: ${siteUrl}\n\n`;
    } else {
      message += `View Your Free Preview\n\n`;
    }
    
    message += `Like what you see? We can make this exact site live under your own domain for a one-time offer of just $23 — no monthly fees, no hidden costs.\n\n`;
    message += `Reply to this message or reach us on WhatsApp to claim your site and get started.\n\n`;
    message += `Best,\nDAPC Visibility Tracker`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'site_generated':
        return 'bg-green-100 text-green-800';
      case 'whatsapp_sent':
        return 'bg-green-100 text-green-800';
      case 'email_found':
        return 'bg-blue-100 text-blue-800';
      case 'email_sent':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Helper function to get status emoji
  const getStatusEmoji = (status) => {
    switch(status) {
      case 'site_generated':
        return '🌐';
      case 'whatsapp_sent':
        return '✅';
      case 'email_found':
        return '✉️';
      case 'email_sent':
        return '📧';
      default:
        return '🔄';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prospect Leads</h1>
        <div className="space-x-3">
          <button 
            onClick={batchGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            ⚡ Generate All Sites
          </button>
          <button 
            onClick={fetchLeads}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.map(lead => {
          // Get the WhatsApp link for this lead
          const waLink = getWhatsAppLink(lead);
          const isWhatsAppSent = lead.status === 'whatsapp_sent';

          return (
            <div key={lead.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <p className="text-gray-600">{lead.address}</p>
                  {lead.phone && (
                    <p className="text-sm text-gray-500">📞 {lead.phone}</p>
                  )}
                  {lead.email && (
                    <p className="text-sm text-gray-500">✉️ {lead.email}</p>
                  )}
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(lead.status)}`}>
                      {getStatusEmoji(lead.status)} {lead.status}
                    </span>
                  </div>
                  {lead.siteUrl && (
                    <a 
                      href={lead.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-600 hover:underline"
                    >
                      🌐 View Site
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  {/* Generate Site Button */}
                  {lead.status !== 'site_generated' && (
                    <button
                      onClick={() => generateSite(lead.id)}
                      disabled={generating[lead.id]}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                      {generating[lead.id] ? '⏳ Generating...' : '🚀 Generate Site'}
                    </button>
                  )}

                  {/* View Site Button (if site exists) */}
                  {lead.status === 'site_generated' && lead.siteUrl && (
                    <a
                      href={lead.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      🌐 View Site
                    </a>
                  )}

                  {/* Find Email Button */}
                  <button
                    onClick={() => findEmail(lead.id)}
                    disabled={findingEmail[lead.id] || !!lead.email}
                    className={`px-3 py-1 rounded text-sm ${
                      findingEmail[lead.id] || !!lead.email
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {findingEmail[lead.id] ? '⏳ Searching...' : lead.email ? '📧 Found' : '🔍 Find Email'}
                  </button>

                  {/* Send WhatsApp Button - Using wa.me Link */}
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 rounded text-sm ${
                        isWhatsAppSent
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      onClick={(e) => {
                        if (isWhatsAppSent) {
                          e.preventDefault();
                          alert('WhatsApp message already sent to this lead');
                        }
                      }}
                    >
                      {isWhatsAppSent ? '✅ Sent' : '📱 Send WhatsApp'}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed"
                      title="No phone number available"
                    >
                      📱 No Phone
                    </button>
                  )}

                  {/* Menu button */}
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋮
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}