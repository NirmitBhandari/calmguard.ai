"use client";

import { useState, useEffect } from "react";
import "./simulate.css";

export default function SimulationPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [danger, setDanger] = useState("medium");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  // Start scenario automatically
  useEffect(() => {
    startScenario();
  }, []);

  async function startScenario() {
    setLoading(true);
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 1, userAction: "" })
    });

    const data = await res.json();
    setMessages([{ from: "ai", text: data.reply }]);
    setDanger(data.danger);
    setFinished(data.finished);
    setLoading(false);
  }

  async function sendAction() {
    if (!input.trim() || finished) return;

    const userText = input;
    setMessages(prev => [...prev, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: step + 1, userAction: userText })
    });

    const data = await res.json();

    setMessages(prev => [...prev, { from: "ai", text: data.reply }]);
    setDanger(data.danger);
    setFinished(data.finished);
    setLoading(false);

    if (!data.finished) setStep(prev => prev + 1);
  }

  return (
    <div className="sim-container">
      <h1 className="sim-title">🔥 Real-Time Disaster Simulation</h1>
      <p className="sim-subtitle">Crisp, short scenarios. AI evaluates & corrects your actions.</p>

      <div className={`danger-meter ${danger}`}>Danger: {danger.toUpperCase()}</div>

      <div className="sim-chatbox">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "ai" ? "bubble-ai" : "bubble-user"}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="typing">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>

      {!finished ? (
        <>
          <input
            className="sim-input"
            placeholder="Type your action..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendAction()}
          />
          <button className="sim-btn" onClick={sendAction}>
            Respond →
          </button>
        </>
      ) : (
        <div className="sim-endcard">
          <h2>🎉 Simulation Complete</h2>
          <p>You handled the situation. Great job!</p>
          <a href="/quiz" className="sim-btn">Go to Quiz →</a>
        </div>
      )}
    </div>
  );
}
