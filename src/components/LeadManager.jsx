// src/components/LeadManager.jsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function LeadManager() {
  const { user } = useUser();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState({});

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
        // Update lead status
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
      fetchLeads(); // Refresh
    } catch (error) {
      console.error('Batch generation failed:', error);
    } finally {
      setLoading(false);
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
        {leads.map(lead => (
          <div key={lead.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <p className="text-gray-600">{lead.address}</p>
                {lead.phone && (
                  <p className="text-sm text-gray-500">📞 {lead.phone}</p>
                )}
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  lead.status === 'site_generated' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lead.status}
                </span>
                {lead.siteUrl && (
                  <a 
                    href={lead.siteUrl} 
                    target="_blank" 
                    className="block mt-2 text-blue-600 hover:underline"
                  >
                    🌐 View Site
                  </a>
                )}
              </div>
              <div className="flex space-x-2">
                {lead.status !== 'site_generated' && (
                  <button
                    onClick={() => generateSite(lead.id)}
                    disabled={generating[lead.id]}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {generating[lead.id] ? '⏳ Generating...' : '🚀 Generate Site'}
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  ⋮
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}