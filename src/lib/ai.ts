export async function fetchAIResponse(prompt: string, userId?: string) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, userId }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch AI response");
    }

    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, something went wrong.";
  }
}