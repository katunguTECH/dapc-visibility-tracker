"use client";

import { useState } from "react";
import VisibilityDashboard from "./VisibilityDashboard";

export default function BusinessSearch() {

const [business, setBusiness] = useState("");
const [location, setLocation] = useState("");
const [results, setResults] = useState<any>(null);
const [loading, setLoading] = useState(false);

const runAudit = async () => {

```
if (!business) {
  alert("Please enter a business name");
  return;
}

setLoading(true);

try {

  const res = await fetch("/api/visibility", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      business,
      location,
    }),
  });

  const data = await res.json();

  setResults(data);

} catch (error) {

  console.error("Audit failed:", error);
  alert("Audit failed. Please try again.");

}

setLoading(false);
```

};

if (results) {
return <VisibilityDashboard data={results} />;
}

return (

```
<div className="text-center px-4">

  <h1 className="text-3xl md:text-4xl font-bold mb-3">
    Kenya Market Visibility Audit
  </h1>

  <p className="text-slate-600 mb-8">
    Analyze your business visibility across Kenya
  </p>

  <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-3xl mx-auto">

    <input
      type="text"
      placeholder="Business name"
      className="border px-4 py-3 rounded-xl w-full md:w-72"
      value={business}
      onChange={(e) => setBusiness(e.target.value)}
    />

    <input
      type="text"
      placeholder="City or county"
      className="border px-4 py-3 rounded-xl w-full md:w-56"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />

    <button
      onClick={runAudit}
      className="bg-blue-600 text-white px-6 py-3 rounded-xl w-full md:w-auto hover:bg-blue-700 transition"
    >
      {loading ? "Analyzing..." : "Start Visibility Audit"}
    </button>

  </div>

</div>
```

);
}
