"use client";

import { useState, useEffect } from "react";
import "./quiz.css";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Professional disaster management questions
  const quizQuestions: Question[] = [
    {
      question: "During an earthquake, what is the safest immediate action if you're indoors?",
      options: [
        "Run outside immediately",
        "Take cover under sturdy furniture and hold on",
        "Stand in a doorway",
        "Go to the highest floor of the building"
      ],
      correctIndex: 1,
      explanation: "Drop, Cover, and Hold On is the recommended safety procedure. Sturdy furniture like tables provides protection from falling debris."
    },
    {
      question: "What is the primary purpose of establishing an emergency meeting point?",
      options: [
        "To store emergency supplies",
        "For family reunification after evacuation",
        "To receive emergency broadcasts",
        "For authorities to set up command posts"
      ],
      correctIndex: 1,
      explanation: "Pre-designated meeting points ensure family members can reunite safely when communication systems are down."
    },
    {
      question: "In flood situations, what depth of moving water is generally considered dangerous for vehicles?",
      options: [
        "6 inches (15 cm)",
        "12 inches (30 cm)",
        "18 inches (45 cm)",
        "24 inches (60 cm)"
      ],
      correctIndex: 1,
      explanation: "Just 12 inches of moving water can float most vehicles, and 2 feet of water can carry away SUVs and trucks."
    },
    {
      question: "What is the recommended duration of emergency water supply per person?",
      options: [
        "1 day",
        "3 days",
        "1 week",
        "2 weeks"
      ],
      correctIndex: 2,
      explanation: "FEMA recommends storing at least 1 gallon of water per person per day for 3-7 days, with one week being the optimal minimum."
    },
    {
      question: "When should you shut off utilities after an earthquake?",
      options: [
        "Immediately after the shaking stops",
        "Only if you smell gas or see damage",
        "Before the earthquake occurs",
        "Wait for authorities to instruct you"
      ],
      correctIndex: 1,
      explanation: "Shut off utilities only if you suspect damage - unnecessary shutdown can complicate recovery efforts."
    },
    {
      question: "What is the 'golden hour' in emergency medicine?",
      options: [
        "The first hour after a disaster strikes",
        "The time window for critical medical intervention",
        "The period when rescue efforts are most effective",
        "The optimal time for evacuation decisions"
      ],
      correctIndex: 1,
      explanation: "The golden hour refers to the critical period following traumatic injury when prompt medical treatment is most likely to prevent death."
    },
    {
      question: "In wildfire situations, what is 'defensible space'?",
      options: [
        "Area around structures cleared of combustible materials",
        "Safe zones designated by firefighters",
        "Evacuation routes away from the fire",
        "Natural barriers that stop fire spread"
      ],
      correctIndex: 0,
      explanation: "Defensible space is the buffer created between buildings and flammable vegetation that slows or stops wildfire spread."
    },
    {
      question: "What does the START triage system prioritize?",
      options: [
        "Children and elderly first",
        "Those with the most severe injuries",
        "Patients with the best chance of survival",
        "Breathing, perfusion, and mental status"
      ],
      correctIndex: 3,
      explanation: "START (Simple Triage and Rapid Treatment) assesses respiration, perfusion, and mental status to categorize patients efficiently."
    },
    {
      question: "During a tsunami warning, what is the safest action?",
      options: [
        "Move to higher ground immediately",
        "Stay indoors on upper floors",
        "Evacuate horizontally inland",
        "Both move to higher ground and go inland"
      ],
      correctIndex: 3,
      explanation: "The best protection is to get to high ground as far inland as possible, as tsunamis can travel inland for miles."
    },
    {
      question: "What is the primary purpose of an Emergency Operations Center (EOC)?",
      options: [
        "Provide medical treatment to victims",
        "Coordinate multi-agency response efforts",
        "Serve as public shelter during disasters",
        "Store emergency equipment and supplies"
      ],
      correctIndex: 1,
      explanation: "EOCs serve as central command facilities for coordination, decision-making, and resource management during emergencies."
    },
    {
      question: "In chemical emergencies, what does 'shelter-in-place' typically involve?",
      options: [
        "Evacuating to a designated shelter",
        "Staying indoors with windows and vents sealed",
        "Moving to the building's strongest room",
        "Using personal protective equipment outdoors"
      ],
      correctIndex: 1,
      explanation: "Shelter-in-place means sealing yourself in a room with minimal outside air exchange to avoid exposure to hazardous materials."
    },
    {
      question: "What is the recommended approach for emergency communication planning?",
      options: [
        "Rely solely on cellular networks",
        "Use multiple redundant communication methods",
        "Depend on social media platforms",
        "Wait for emergency broadcast systems"
      ],
      correctIndex: 1,
      explanation: "Redundant communication methods (cell, landline, radio, satellite) ensure connectivity when some systems fail."
    },
    {
      question: "During power outages, what food safety rule should be followed for refrigerated items?",
      options: [
        "Discard all refrigerated food after 2 hours",
        "Keep refrigerator closed to maintain temperature",
        "Transfer food to coolers with ice",
        "Cook all meat immediately"
      ],
      correctIndex: 1,
      explanation: "A closed refrigerator keeps food safe for about 4 hours; a full freezer for 48 hours (24 hours if half-full)."
    },
    {
      question: "What is the primary goal of disaster risk reduction?",
      options: [
        "Eliminate all natural hazards",
        "Prevent disasters from occurring",
        "Reduce vulnerability and exposure",
        "Increase emergency response funding"
      ],
      correctIndex: 2,
      explanation: "Disaster risk reduction focuses on minimizing vulnerabilities and exposure to hazards through preventive measures."
    },
    {
      question: "In emergency first aid, what does ABC stand for?",
      options: [
        "Ambulance, Bandage, Compress",
        "Airway, Breathing, Circulation",
        "Alert, Breathing, CPR",
        "Assessment, Bleeding, Care"
      ],
      correctIndex: 1,
      explanation: "ABC protocol prioritizes Airway, Breathing, and Circulation as the fundamental steps in emergency patient assessment."
    },
    {
      question: "What is the purpose of conducting emergency drills?",
      options: [
        "To test emergency equipment",
        "To identify planning weaknesses",
        "To satisfy regulatory requirements",
        "To train for muscle memory and reduce panic"
      ],
      correctIndex: 3,
      explanation: "Regular drills create muscle memory and automatic responses, reducing panic and improving performance during actual emergencies."
    },
    {
      question: "During hurricane preparedness, what does the '5-day cone of uncertainty' represent?",
      options: [
        "The area that will definitely be affected",
        "The probable path of the storm center",
        "Regions under mandatory evacuation",
        "Areas with flood watch warnings"
      ],
      correctIndex: 1,
      explanation: "The cone shows the probable path of the storm's center, with the entire track remaining within the cone 60-70% of the time."
    },
    {
      question: "What is the recommended approach for emergency financial preparedness?",
      options: [
        "Keep large amounts of cash at home",
        "Maintain emergency savings equivalent to 3-6 months of expenses",
        "Rely on credit cards for emergency expenses",
        "Depend on government assistance programs"
      ],
      correctIndex: 1,
      explanation: "Financial experts recommend 3-6 months of living expenses in emergency savings to cover unexpected situations."
    },
    {
      question: "In mass casualty incidents, what principle guides resource allocation?",
      options: [
        "Treat the most critically injured first",
        "Do the greatest good for the greatest number",
        "Prioritize children and medical personnel",
        "Follow first-come, first-served basis"
      ],
      correctIndex: 1,
      explanation: "The utilitarian principle of 'greatest good for the greatest number' guides triage and resource allocation in mass casualty events."
    },
    {
      question: "What is the primary benefit of community emergency response teams (CERT)?",
      options: [
        "Replace professional emergency services",
        "Provide immediate neighborhood assistance",
        "Reduce insurance costs for community members",
        "Coordinate with federal response agencies"
      ],
      correctIndex: 1,
      explanation: "CERT volunteers provide immediate assistance in their neighborhoods when professional responders may be overwhelmed or delayed."
    }
  ];

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setQuestions(quizQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  function handleAnswer(index: number) {
    const correct = questions[current].correctIndex;
    const isAnswerCorrect = index === correct;
    
    setSelectedAnswer(index);
    setIsCorrect(isAnswerCorrect);
    setShowPopup(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  }

  function handleContinue() {
    setShowPopup(false);
    setSelectedAnswer(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  }

  function restartQuiz() {
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setShowPopup(false);
    setSelectedAnswer(null);
  }

  const progressPercentage = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="bg-grid"></div>
      <div className="scan-line"></div>

      <h1 className="quiz-title">Disaster Management Quiz</h1>
      <p className="quiz-subtitle">
        Test your knowledge of professional disaster response and emergency preparedness procedures
      </p>

      {loading ? (
        <div className="loading-text">
          Loading professional assessment questions...
        </div>
      ) : finished ? (
        <div className="score-card">
          <h2 className="score-text">Assessment Complete: {score} / {questions.length}</h2>
          
          {score >= 16 && (
            <div className="score-badge score-good">EXPERT LEVEL</div>
          )}
          {score >= 12 && score <= 15 && (
            <div className="score-badge score-medium">PROFICIENT</div>
          )}
          {score < 12 && (
            <div className="score-badge score-bad">NEEDS TRAINING</div>
          )}
          
          <p style={{color: '#cccccc', marginTop: '20px', lineHeight: '1.6'}}>
            {score >= 16 
              ? "Excellent! You demonstrate advanced disaster management knowledge."
              : score >= 12
              ? "Good understanding of emergency procedures. Consider additional training."
              : "Review emergency protocols and consider professional training courses."
            }
          </p>
          
          <button className="restart-btn" onClick={restartQuiz}>
            Retake Assessment
          </button>
        </div>
      ) : questions.length > 0 && (
        <div className="quiz-card">
          <div className="quiz-progress">
            <span className="progress-text">Question {current + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">Score: {score}</span>
          </div>

          <h3 className="quiz-question">{questions[current].question}</h3>

          <div className="answer-options">
            {questions[current].options.map((option: string, i: number) => (
              <div
                key={i}
                className="answer-option"
                onClick={() => handleAnswer(i)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2 className={`popup-title ${isCorrect ? 'popup-correct' : 'popup-incorrect'}`}>
              {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
            </h2>
            
            <p className="popup-message">
              {isCorrect 
                ? "Well done! Your understanding of emergency procedures is accurate."
                : "Incorrect answer. Understanding proper protocols is crucial for safety."
              }
            </p>

            {!isCorrect && (
              <div className="correct-answer">
                <strong>Correct Answer:</strong>
                {questions[current].options[questions[current].correctIndex]}
              </div>
            )}

            <div className="correct-answer">
              <strong>Professional Insight:</strong>
              {questions[current].explanation}
            </div>

            <button className="continue-btn" onClick={handleContinue}>
              {current + 1 === questions.length ? "View Results" : "Continue"}
            </button>
          </div>
        </div>
      )}

      <div className="footer">
        Calm Guard AI Professional Assessment • Emergency Preparedness Evaluation
      </div>
    </div>
  );
}