"use client";

import { useState } from "react";

export default function LeadsPage() {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/prospects/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setLeads(data.leads || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Lead Finder</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. car garages in Nairobi"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {leads.length > 0 && (
        <p className="text-sm text-gray-500 mb-2">
          {leads.length} business{leads.length === 1 ? "" : "es"} found with no website on file.
        </p>
      )}

      <ul className="space-y-3">
        {leads.map((lead) => (
          <li key={lead.placeId} className="border rounded p-3">
            <p className="font-medium">{lead.name}</p>
            <p className="text-sm text-gray-600">{lead.address}</p>
            {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
