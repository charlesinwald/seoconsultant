import type React from "react"
import { useState, useEffect } from "react"

interface ScoreGaugeProps {
  score: number
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const getScoreColor = (s: number) => {
    if (s >= 90) return "var(--chart-1)" // Primary green
    if (s >= 70) return "var(--chart-2)" // Secondary lime
    if (s >= 50) return "var(--chart-4)" // Orange
    return "var(--chart-3)" // Red
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      // Animate the score counting
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = score / steps
      let currentStep = 0
      
      const scoreTimer = setInterval(() => {
        currentStep++
        const newScore = Math.min(Math.round(increment * currentStep), score)
        setAnimatedScore(newScore)
        
        if (currentStep >= steps || newScore >= score) {
          setAnimatedScore(score)
          clearInterval(scoreTimer)
        }
      }, duration / steps)
      
      return () => clearInterval(scoreTimer)
    }, 300) // Start animation after a short delay

    return () => clearTimeout(timer)
  }, [score])

  const color = getScoreColor(animatedScore)
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-64 h-64 animate-scale-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full animate-pulse"></div>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          className="text-border"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
        />
        {/* Progress circle */}
        <circle
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={isAnimating ? strokeDashoffset : circumference}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          className="drop-shadow-sm"
          style={{
            transition: "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
            filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <span className="text-6xl font-bold font-[family-name:var(--font-work-sans)] transition-colors duration-500" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-foreground/70 text-lg font-medium mt-2">Overall Score</span>
        <div
          className="w-12 h-1 bg-gradient-to-r from-transparent via-current to-transparent mt-2 opacity-30"
          style={{ color }}
        ></div>
      </div>
    </div>
  )
}
