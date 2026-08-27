"use client";

import { useState } from "react";

export default function ProspectsPage() {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

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

  async function handleSaveLead(lead) {
    setSavingId(lead.placeId);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save lead");
      setSavedIds((prev) => [...prev, lead.placeId]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
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
          <li key={lead.placeId} className="border rounded p-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.address}</p>
              {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
            </div>
            <button
              onClick={() => handleSaveLead(lead)}
              disabled={savingId === lead.placeId || savedIds.includes(lead.placeId)}
              className="shrink-0 bg-blue-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
            >
              {savedIds.includes(lead.placeId)
                ? "Saved ✓"
                : savingId === lead.placeId
                ? "Saving..."
                : "Save Lead"}
            </button>
          </li>
        ))}
      </ul>

      {savedIds.length > 0 && (
        <p className="text-sm text-gray-500 mt-6">
          Saved leads can be found on the{" "}
          <a href="/admin/leads" className="text-blue-600 underline">
            Leads dashboard
          </a>
          .
        </p>
      )}
    </div>
  );
}