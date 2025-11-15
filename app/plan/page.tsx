"use client";

import { useState } from "react";
import "./plan.css";

interface SafetyPlan {
  riskSummary: string;
  riskLevel: "low" | "medium" | "high";
  checklist: string[];
  evacuation: string[];
  helpline: string;
  motivation: string;
  estimatedTime: string;
  priorityLevel: string;
  resourcesNeeded: string[];
}

export default function PlanPage() {
  const [city, setCity] = useState("");
  const [disaster, setDisaster] = useState("Earthquake");
  const [plan, setPlan] = useState<SafetyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockPlans: { [key: string]: SafetyPlan } = {
    Earthquake: {
      riskSummary: "High seismic activity zone",
      riskLevel: "high",
      checklist: [
        "Identify safe spots in each room (under sturdy tables, against interior walls)",
        "Secure heavy furniture and appliances to walls",
        "Prepare emergency kit with water, food, and first aid supplies",
        "Practice drop, cover, and hold on drills",
        "Know how to shut off gas, water, and electricity"
      ],
      evacuation: [
        "Evacuate if you smell gas or see structural damage",
        "Use stairs, not elevators",
        "Move to open areas away from buildings and power lines",
        "Follow designated evacuation routes",
        "Assemble at predetermined meeting points"
      ],
      helpline: "National Disaster Response Force: 108 | Earthquake Helpline: 011-24363260",
      motivation: "Being prepared can reduce earthquake-related injuries by up to 75%",
      estimatedTime: "15-30 minutes for full evacuation",
      priorityLevel: "Critical",
      resourcesNeeded: ["Emergency kit", "Whistle", "Dust masks", "Flashlight"]
    },
    Flood: {
      riskSummary: "Moderate flood risk area",
      riskLevel: "medium",
      checklist: [
        "Monitor weather alerts and flood warnings",
        "Move valuables to higher floors",
        "Prepare sandbags for doorways",
        "Charge all electronic devices",
        "Store important documents in waterproof containers"
      ],
      evacuation: [
        "Evacuate when authorities issue orders",
        "Avoid walking or driving through flood waters",
        "Move to designated shelters or higher ground",
        "Take emergency kit and essential medications",
        "Follow marked evacuation routes"
      ],
      helpline: "Flood Control Room: 1070 | Disaster Management: 1078",
      motivation: "Early evacuation can prevent 90% of flood-related fatalities",
      estimatedTime: "1-2 hours depending on water levels",
      priorityLevel: "High",
      resourcesNeeded: ["Life jackets", "Waterproof bags", "Emergency radio", "Dry clothing"]
    },
    Fire: {
      riskSummary: "Urban area with standard fire risk",
      riskLevel: "medium",
      checklist: [
        "Install and test smoke detectors on every floor",
        "Keep fire extinguishers accessible and maintained",
        "Create and practice family escape plan",
        "Identify two ways out of every room",
        "Clear escape routes of obstructions"
      ],
      evacuation: [
        "Alert all occupants and call emergency services",
        "Crawl low under smoke to nearest exit",
        "Feel doors before opening - if hot, use alternative route",
        "Use stairs, never elevators",
        "Assemble at designated meeting point outside"
      ],
      helpline: "Fire Emergency: 101 | Disaster Management: 108",
      motivation: "Proper planning can reduce fire evacuation time by 50%",
      estimatedTime: "2-5 minutes for building evacuation",
      priorityLevel: "Critical",
      resourcesNeeded: ["Fire extinguishers", "Smoke detectors", "Escape ladders", "First aid kit"]
    },
    Cyclone: {
      riskSummary: "Coastal region with cyclone vulnerability",
      riskLevel: "high",
      checklist: [
        "Monitor cyclone warnings and updates regularly",
        "Secure outdoor objects and reinforce windows",
        "Prepare emergency kit for 3-7 days",
        "Identify strongest room in house for shelter",
        "Charge all communication devices"
      ],
      evacuation: [
        "Evacuate when Category 3 or higher cyclone approaches",
        "Move to designated cyclone shelters or sturdy buildings",
        "Avoid coastal areas and river banks",
        "Follow evacuation routes away from the coast",
        "Take emergency supplies and important documents"
      ],
      helpline: "Cyclone Warning Center: 1070 | Emergency Services: 108",
      motivation: "Timely evacuation reduces cyclone-related mortality by 80%",
      estimatedTime: "4-6 hours before landfall",
      priorityLevel: "Critical",
      resourcesNeeded: ["Emergency radio", "Water purification tablets", "Non-perishable food", "Emergency lighting"]
    }
  };

  async function generatePlan() {
    if (!city.trim()) return;

    setPlan(null);
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use mock data for demonstration
      const generatedPlan = mockPlans[disaster] || mockPlans.Earthquake;
      setPlan(generatedPlan);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  }

  const downloadPlan = () => {
    if (!plan) return;
    
    const planText = `
SAFETY PLAN - ${disaster.toUpperCase()}
Location: ${city}
Generated: ${new Date().toLocaleString()}

RISK ASSESSMENT:
${plan.riskSummary}
Risk Level: ${plan.riskLevel.toUpperCase()}
Priority: ${plan.priorityLevel}
Estimated Evacuation Time: ${plan.estimatedTime}

PREPARATION CHECKLIST:
${plan.checklist.map(item => `• ${item}`).join('\n')}

EVACUATION STEPS:
${plan.evacuation.map(step => `• ${step}`).join('\n')}

REQUIRED RESOURCES:
${plan.resourcesNeeded.map(resource => `• ${resource}`).join('\n')}

EMERGENCY CONTACTS:
${plan.helpline}

SAFETY NOTE:
${plan.motivation}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-plan-${city}-${disaster}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="plan-container">
      <div className="bg-grid"></div>
      <div className="scan-line"></div>

      <h1 className="plan-title">Safety Plan Generator</h1>
      <p className="plan-subtitle">
        Generate comprehensive emergency preparedness plans tailored to your location and specific disaster scenarios.
        Ensure your safety with professionally crafted evacuation strategies and checklists.
      </p>

      <div className="plan-card">
        <div className="input-group">
          <input
            className="plan-input"
            placeholder="Enter your city or location"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generatePlan()}
          />

          <select
            className="plan-select"
            value={disaster}
            onChange={(e) => setDisaster(e.target.value)}
          >
            <option value="Earthquake">Earthquake</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Cyclone">Cyclone</option>
          </select>
        </div>

        <button 
          className="generate-btn" 
          onClick={generatePlan}
          disabled={loading || !city.trim()}
        >
          <i className="fas fa-file-alt"></i>
          {loading ? "Generating Plan..." : "Generate Safety Plan"}
        </button>

        {loading && (
          <div className="loading-container">
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p>Creating your personalized safety plan...</p>
          </div>
        )}

        {plan && (
          <div className="output-card">
            <h2 className="output-title">
              {disaster} Safety Plan for {city}
              <span className={`risk-badge ${plan.riskLevel}`}>
                {plan.riskLevel.toUpperCase()} RISK
              </span>
            </h2>

            <div className="plan-stats">
              <div className="stat-card">
                <div className="stat-value">{plan.priorityLevel}</div>
                <div className="stat-label">Priority Level</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{plan.estimatedTime}</div>
                <div className="stat-label">Evacuation Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{plan.checklist.length}</div>
                <div className="stat-label">Action Items</div>
              </div>
            </div>

            <div className="output-section">
              <strong>Risk Assessment</strong>
              <p>{plan.riskSummary}</p>
            </div>

            <div className="output-section">
              <strong>Preparation Checklist</strong>
              <ul>
                {plan.checklist.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="output-section">
              <strong>Required Resources</strong>
              <ul>
                {plan.resourcesNeeded.map((resource: string, i: number) => (
                  <li key={i}>{resource}</li>
                ))}
              </ul>
            </div>

            <div className="output-section">
              <strong>Evacuation Procedure</strong>
              <ul>
                {plan.evacuation.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="output-section">
              <strong>Emergency Contacts</strong>
              <p>{plan.helpline}</p>
            </div>

            <div className="output-section">
              <strong>Safety Note</strong>
              <p>{plan.motivation}</p>
            </div>

            <button className="download-btn" onClick={downloadPlan}>
              <i className="fas fa-download"></i>
              Download Safety Plan
            </button>
          </div>
        )}
      </div>

      <div className="footer">
        Calm Guard AI Safety System • Professional Emergency Preparedness
      </div>
    </div>
  );
}