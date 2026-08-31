"use client";

import { useEffect, useState } from "react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [findingEmailId, setFindingEmailId] = useState(null);
  const [sendingId, setSendingId] = useState(null);
  const [error, setError] = useState(null);

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_leads_auth") === "true") {
      setAuthorized(true);
    }
    setCheckingAuth(false);
  }, []);

  function handlePasswordSubmit() {
    if (passwordInput === "Work@2026") {
      sessionStorage.setItem("admin_leads_auth", "true");
      setAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
      setPasswordInput("");
    }
  }

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(Array.isArray(data.leads) ? data.leads : []);
    } catch (err) {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) fetchLeads();
  }, [authorized]);

  async function handleGenerate(leadId) {
    setGeneratingId(leadId);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/generate-site`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      await fetchLeads();
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleFindEmail(leadId) {
    setFindingEmailId(leadId);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/find-email`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email search failed");
      if (!data.success) {
        setError("No email found for this business");
      }
      await fetchLeads();
    } catch (err) {
      setError(err.message);
    } finally {
      setFindingEmailId(null);
    }
  }

  async function handleSendEmail(leadId, isKenyan) {
    setSendingId(leadId);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isKenyan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      await fetchLeads();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingId(null);
    }
  }

  if (checkingAuth) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Access Required</h2>
            <p className="text-gray-600 mt-1">Enter the admin password to continue</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Verify Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <p className="p-6 text-gray-500">Loading leads...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Leads &amp; AI Site Generator</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {leads.length === 0 && (
        <p className="text-gray-500">
          No leads yet. Find some on the{" "}
          <a href="/prospects" className="text-blue-600 underline">Lead Finder</a>.
        </p>
      )}

      <ul className="space-y-3">
        {leads.map((lead) => (
          <li key={lead.id} className="border rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm text-gray-600">{lead.address}</p>
                {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
                {lead.email && <p className="text-sm text-blue-600">{lead.email}</p>}
                <p className="text-xs text-gray-400 mt-1">Status: {lead.status}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {lead.status !== "site_generated" && lead.status !== "email_sent" && (
                  <button
                    onClick={() => handleGenerate(lead.id)}
                    disabled={generatingId === lead.id}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    {generatingId === lead.id ? "Generating..." : "Generate Site"}
                  </button>
                )}

                {(lead.status === "site_generated" || lead.status === "email_sent") && (
                  <a href={`/sites/${lead.id}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">View Site</a>
                )}

                {(lead.status === "site_generated" || lead.status === "email_sent") && !lead.email && (
                  <button
                    onClick={() => handleFindEmail(lead.id)}
                    disabled={findingEmailId === lead.id}
                    className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    {findingEmailId === lead.id ? "Searching..." : "Find Email"}
                  </button>
                )}

                {(lead.status === "site_generated") && lead.email && (
                  <button
                    onClick={() => handleSendEmail(lead.id, true)}
                    disabled={sendingId === lead.id}
                    className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    {sendingId === lead.id ? "Sending..." : "Send Email"}
                  </button>
                )}

                {lead.status === "email_sent" && (
                  <span className="text-xs text-green-700 font-medium">Email Sent</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
