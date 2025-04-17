"use client"

import { useState } from "react"
import StudyGuideList from "./components/StudyGuideList"
import "./App.css"

function App() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("create")

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input }),
      })

      if (!response.ok) throw new Error("Failed to write to database")

      setInput("")
    } catch (error) {
      console.error("Error writing to database:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">StudyGuide AI</span>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Guide
          </button>
          <button className={`tab-button ${activeTab === "view" ? "active" : ""}`} onClick={() => setActiveTab("view")}>
            View Guides
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="create-section">
            <div className="card">
              <div className="card-content">
                <h1 className="section-title">Generate a Study Guide</h1>
                <p className="section-description">
                  Enter a topic and our AI will create a comprehensive study guide for you.
                </p>

                <div className="input-group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a topic (e.g. Quantum Physics, French Revolution, etc.)"
                    className="text-input"
                  />
                  <button onClick={handleSubmit} disabled={!input.trim() || isGenerating} className="submit-button">
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>

                {isGenerating && (
                  <div className="loading-message">Creating your study guide... This may take a moment.</div>
                )}
              </div>
            </div>

            <div className="how-it-works">
              <h2 className="section-title">How It Works</h2>
              <p className="section-description">
                Our AI-powered study guide generator creates comprehensive learning materials in seconds.
              </p>

              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Enter a Topic</h3>
                    <p>Type any subject you want to learn about in the input field.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Generate</h3>
                    <p>Our AI processes your request and creates a structured study guide.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Study & Learn</h3>
                    <p>Access your guide anytime and expand your knowledge efficiently.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <StudyGuideList />
        )}
      </main>
    </div>
  )
}

export default App
