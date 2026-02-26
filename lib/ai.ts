// lib/ai.ts
export async function fetchAIResponse(prompt: string, userId?: string) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userId }),
  });
  const data = await res.json();
  return data.text;
}