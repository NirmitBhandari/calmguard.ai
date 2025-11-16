export async function POST(request) {
  try {
    const { step = 1, userAction = "" } = await request.json();

    const API_KEY = "AIzaSyDS-XCpCQBMuFbNaeVHqtlxXtOcnNgiadw";
    const MODEL = "gemini-2.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    // PROMPT (stable, no JSON)
    const prompt =
      step === 1
        ? `
Generate a short disaster scenario in 2–3 lines.
Pick one: earthquake, flood, fire, or chemical leak.
Include danger and end with: "What is your first action?"
Keep the message short, simple, crisp.
`
        : `
The user did: "${userAction}".
Continue the scenario in 2 short lines.
Correct their action if unsafe. Praise if safe.
End with: "What do you do next?"
`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const raw = await res.text();
    console.log("RAW GEMINI:\n", raw);

    // Extract the model's text (Gemini 2.x structure)
    let text = "";
    try {
      const data = JSON.parse(raw);
      text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.output_text ||
        raw;
    } catch {
      text = raw;
    }

    // Danger detection (simple)
    let danger = "medium";
    if (/fire|collapse|smoke|shake|flood|explosion|toxic|rising/i.test(text))
      danger = "high";
    if (/safe|stabilize|rescued|clear/i.test(text))
      danger = "low";

    // Determine if scenario finished
    const finished = /simulation complete|end of scenario|you survived/i.test(
      text.toLowerCase()
    );

    return new Response(
      JSON.stringify({
        reply: text.trim(),
        danger,
        finished,
        feedback: "" // Not needed, because feedback is in reply directly
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("SIMULATE ERROR:", err);
    return new Response(
      JSON.stringify({
        reply: "⚠ AI is not responding. Try again.",
        danger: "medium",
        finished: false
      }),
      { status: 200 }
    );
  }
}
