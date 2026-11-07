"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Only allow redirecting back to a same-site, admin-area path — never
// follow an arbitrary "next" value, or this becomes an open redirect.
const ALLOWED_NEXT_PREFIXES = ["/admin-reports", "/admin/reports", "/prospects"];

function getSafeNext(next: string | null): string {
  if (next && ALLOWED_NEXT_PREFIXES.some((p) => next.startsWith(p))) {
    return next;
  }
  return "/admin-reports";
}

// Which password/cookie area this login is for. Middleware passes this
// along as ?area=... ; default to "reports" for direct visits to this page.
function getArea(area: string | null): "reports" | "leads" {
  return area === "leads" ? "leads" : "reports";
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const area = getArea(searchParams.get("area"));
  const areaLabel = area === "leads" ? "Leads" : "Admin Reports";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, area }),
    });

    if (res.ok) {
      const next = getSafeNext(searchParams.get("next"));
      router.push(next); // Redirect back to whatever page sent them here
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">{areaLabel} Access</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder={`Enter ${areaLabel.toLowerCase()} password`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
            required
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
