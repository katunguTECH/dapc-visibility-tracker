"use client";

import { useState } from "react";

export default function AdminBusinessesPage() {
  const [businessName, setBusinessName] = useState("");
  const [canonicalName, setCanonicalName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [seoScore, setSeoScore] = useState(50);
  const [overallScore, setOverallScore] = useState(50);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("/api/admin/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: businessName,
        canonicalName,
        address,
        phone,
        email,
        website,
        mapsPresence: true,
        mapsUrl,
        seoScore: parseInt(seoScore as any),
        overallScore: parseInt(overallScore as any),
        social: {
          facebook: facebook || false,
          instagram: instagram || false,
          twitter: false,
          tiktok: false,
        },
      }),
    });
    
    if (response.ok) {
      setStatus("Business added successfully!");
      // Clear form
      setBusinessName("");
      setCanonicalName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setMapsUrl("");
      setSeoScore(50);
      setOverallScore(50);
      setFacebook("");
      setInstagram("");
    } else {
      setStatus("Error adding business");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add/Edit Business</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Canonical Name (for display)</label>
          <input
            type="text"
            value={canonicalName}
            onChange={(e) => setCanonicalName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Google Maps URL</label>
          <input
            type="url"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://maps.google.com/?q=..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Score (0-100)</label>
            <input
              type="number"
              value={seoScore}
              onChange={(e) => setSeoScore(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Overall Score (0-100)</label>
            <input
              type="number"
              value={overallScore}
              onChange={(e) => setOverallScore(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Facebook URL (or leave empty)</label>
          <input
            type="text"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Instagram URL (or leave empty)</label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Business
        </button>
        
        {status && (
          <p className="text-center text-sm text-green-600">{status}</p>
        )}
      </form>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Always verify business information against Google Maps before saving.
          The canonical name should match exactly what appears on Google.
        </p>
      </div>
    </div>
  );
}