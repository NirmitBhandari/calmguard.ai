"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebaseConfig";
import Link from "next/link";
import "./globals.css";


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  // Create LED particles
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.led-particles');
      if (!container) return;

      // Clear existing particles
      container.innerHTML = '';

      // Create new particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'led-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        container.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 10000); // Refresh particles every 10s

    return () => clearInterval(interval);
  }, []);

  // Auth protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    signOut(auth).then(() => router.replace("/login"));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* LED Background Effects */}
      <div className="led-grid"></div>
      <div className="led-scan-line"></div>
      <div className="led-particles"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">Calm Guard AI</div>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/radar">Radar</Link>
          <Link href="/simulate">Simulation</Link>
          <Link href="/plan">Plan</Link>
          <Link href="/quiz">Quiz</Link>
        </div>

        {/* Profile / Welcome */}
        <div className="profile-container">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="profile-img"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
          ) : (
            <span
              className="welcome-text"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Welcome, {user?.email?.split("@")[0]}
            </span>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p>{user?.displayName || user?.email?.split("@")[0]}</p>
              <div className="menu-item" onClick={handleLogout}>
                Logout Session
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-content">
          <h1 className="hero-title">
            INTELLIGENT  
            <br /> DISASTER  
            <br /> PREPAREDNESS  
            <br /> PLATFORM
          </h1>

          <p className="hero-subtitle">
            Advanced emergency response system with real-time monitoring, 
            predictive analytics, and comprehensive safety planning. 
            Protect your community with enterprise-grade disaster management solutions.
          </p>

         
        </div>


      </section>

      {/* About Section */}
      <section className="info-section fade-in">
        <div className="info-block">
          <h2>SYSTEM OVERVIEW</h2>
          <p>
            Calm Guard AI provides advanced AI-powered disaster training  
            with real-time simulations, risk assessments and  
            personalized safety plans to enhance your readiness and response capabilities.
          </p>
        </div>

        <div className="info-block">
          <h2>CORE CAPABILITIES</h2>
          <ul>
            <li>Real-Time Disaster Radar Monitoring</li>
            <li>Immersive AI Simulation Training</li>
            <li>Personalized Safety Plan Generation</li>
            <li>Professional Readiness Assessment</li>
          </ul>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="feature-cards fade-in">
        <Link className="feature-card" href="/radar">
          <h3>Disaster Radar</h3>
          <p>Real-time threat monitoring and early warning systems</p>
        </Link>
        <Link className="feature-card" href="/simulate">
          <h3>AI Simulation</h3>
          <p>Immersive training with guided survival scenarios</p>
        </Link>
        <Link className="feature-card" href="/plan">
          <h3>Safety Plan</h3>
          <p>Custom emergency protocols and evacuation planning</p>
        </Link>
        <Link className="feature-card" href="/quiz">
          <h3>Readiness Quiz</h3>
          <p>Professional assessment of disaster preparedness</p>
        </Link>
      </section>
    </div>
  );
}