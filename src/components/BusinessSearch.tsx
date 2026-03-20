// Inside BusinessSearch.tsx, update the runAudit function:

const runAudit = async () => {
  if (!business) return;
  setLoading(true);

  try {
    // Change /api/audit to /api/visibility
    const res = await fetch(
      `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
    );

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    setResult(data);

  } catch (error) {
    console.error("Audit error:", error);
  } finally {
    setLoading(false);
  }
};