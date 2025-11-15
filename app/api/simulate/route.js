export async function POST(request) {
  try {
    const { step, userAction } = await request.json();

    const API_KEY = "AIzaSyDS-XCpCQBMuFbNaeVHqtlxXtOcnNgiadw";
    const MODEL = "gemini-2.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt =
      step === 1
        ? `
Generate a VERY short, crisp disaster scenario in 2–3 lines.  
Rules:
- Pick one disaster: earthquake, flood, fire, or chemical leak.
- Describe immediate danger in simple language.
- Mention the user's location (classroom, lab, corridor).
- NO long story. NO extra fluff.
- End with: "What is your first action?"
        `
        : `
Continue the disaster simulation from the previous step.

User action: "${userAction}"

Rules:
- Reply in 2–3 lines ONLY.
- Be practical and realistic.
- Describe what happens next.
- Give one survival instruction.
- End with: "What do you do next?"
      `;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    console.log("RAW GEMINI:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return new Response(
        JSON.stringify({
          response: "⚠ Invalid AI response.",
          danger: "medium"
        }),
        { status: 200 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠ No text returned.";

    // Simple danger detection
    let danger = "medium";
    if (/fire|smoke|shake|flood|collapse/i.test(reply)) danger = "high";
    if (/safe|stable/i.test(reply)) danger = "low";

    return new Response(
      JSON.stringify({
        response: reply,
        danger
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return new Response(
      JSON.stringify({
        response: "⚠ Server crashed.",
        danger: "medium"
      }),
      { status: 500 }
    );
  }
}
