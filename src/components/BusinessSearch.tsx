'use client';

import { useState } from 'react';

export default function BusinessSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartAudit = async () => {
    if (!query || !location) return alert('Enter business name and location');

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location })
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setResult(`Visibility Score: ${data.score}%`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Kenya Market Visibility Audit</h2>
      <input
        type="text"
        placeholder="Business Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 m-2"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 m-2"
      />
      <button
        onClick={handleStartAudit}
        className="bg-blue-600 text-white px-4 py-2 m-2"
        disabled={loading}
      >
        {loading ? 'Auditing...' : 'Start Visibility Audit'}
      </button>

      {result && <p className="mt-4">{result}</p>}
    </div>
  );
}