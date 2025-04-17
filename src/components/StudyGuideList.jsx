"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import "./StudyGuideList.css"
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function StudyGuideList() {
  
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openGuides, setOpenGuides] = useState([])

  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("studyguides").select("text").order("id", { ascending: false })

      if (error) {
        setError("Failed to fetch study guides: " + error.message)
      } else {
        setData(data || [])
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getData()
  }, [getData])

  const toggleGuide = (index) => {
    setOpenGuides((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  if (error) {
    return (
      <div className="error-alert">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="study-guide-list">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-icon">📚</span>
            Your Study Guides
          </h2>
          <p className="card-description">
            Expand each guide to view its content. All your generated study materials are saved here.
          </p>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="loading-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No study guides yet</h3>
              <p>Generate your first study guide to get started.</p>
            </div>
          ) : (
            <div className="accordion">
              {data.map((item, index) => {
                const lines = item.text?.split("\n") || []
                const title = lines[0] || "Untitled Study Guide"
                const body = lines.slice(1).join("\n")
                const isOpen = openGuides.includes(index)

                return (
                  <div key={index} className="accordion-item">
                    <button className={`accordion-header ${isOpen ? "active" : ""}`} onClick={() => toggleGuide(index)}>
                      {title}
                      <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="accordion-content">
                        <div className="study-guide-content">{body}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
