"use client";

import { useState } from "react";
import "./radar.css";

interface DisasterData {
  type: string;
  location: string;
  distance: number;
  severity: "safe" | "caution" | "danger";
}

export default function RadarPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DisasterData | null>(null);
  const [error, setError] = useState("");

  const disasterData: DisasterData[] = [
    { type: "Major Flood Alert", location: "Kolkata Region", distance: 320.5, severity: "safe" },
    { type: "Earthquake Warning", location: "Delhi NCR", distance: 150.2, severity: "caution" },
    { type: "Cyclone Approaching", location: "Chennai Coast", distance: 80.7, severity: "danger" },
    { type: "Wildfire Reported", location: "Mumbai Outskirts", distance: 420.1, severity: "safe" },
    { type: "Landslide Alert", location: "Shimla Hills", distance: 280.9, severity: "caution" },
    { type: "Tornado Warning", location: "Bangalore Rural", distance: 95.3, severity: "danger" },
    { type: "Severe Storm", location: "Hyderabad District", distance: 180.6, severity: "caution" },
    { type: "Tsunami Watch", location: "Andaman Coast", distance: 450.2, severity: "safe" }
  ];

  async function checkDisaster() {
    if (!city.trim()) {
      setError("Please enter a city name to scan for disasters.");
      return;
    }

    if (city.length < 2) {
      setError("Please enter a valid city name.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const randomDisaster = disasterData[Math.floor(Math.random() * disasterData.length)];
      setResult(randomDisaster);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getBadgeInfo = (distance: number) => {
    if (distance > 250) {
      return { class: "safe", text: "SAFE ZONE" };
    } else if (distance > 100) {
      return { class: "caution", text: "CAUTION ADVISED" };
    } else {
      return { class: "danger", text: "DANGER ZONE" };
    }
  };

  return (
    <>
      <div className="bg-grid"></div>
      <div className="scan-line"></div>
      
      <div className="radar-container">
        <div className="logo">
          <i className="fas fa-satellite-dish logo-icon"></i>
          <div className="brand">
            <h1 className="radar-title">DISASTER RADAR</h1>
            <div className="brand-subtitle">Calm Guard AI</div>
          </div>
        </div>
        
        <p className="radar-subtitle">
          Real-time disaster monitoring and threat assessment system.<br />
          Enter your location to scan for active incidents.
        </p>

        <div className="radar-card">
          <input
            className="radar-input"
            placeholder="Enter city or location (e.g., Delhi, Mumbai, Chennai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkDisaster()}
          />

          <button 
            className="scan-btn" 
            onClick={checkDisaster}
            disabled={loading}
          >
            <div className="btn-content">
              <i className="fas fa-search-location"></i>
              <span>{loading ? "Scanning..." : "Scan Location"}</span>
            </div>
          </button>

          {loading && (
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}

          {error && (
            <div className="error-text">
              {error}
            </div>
          )}

          {result && (
            <div className="result-card">
              <h2 className="result-title">{result.type}</h2>
              <div className="result-line">
                <strong>Location:</strong>
                <span>{result.location}</span>
              </div>
              <div className="result-line">
                <strong>Distance:</strong>
                <span>{result.distance.toFixed(1)} km from {city}</span>
              </div>
              <div className="result-line">
                <strong>Status:</strong>
                <span>Active Monitoring</span>
              </div>
              <div className={`badge ${getBadgeInfo(result.distance).class}`}>
                <span className="status-indicator"></span>
                {getBadgeInfo(result.distance).text}
              </div>
              <div className="timestamp">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        <div className="footer">
          Calm Guard AI Monitoring System • Real-time Threat Assessment
        </div>
      </div>
    </>
  );
}