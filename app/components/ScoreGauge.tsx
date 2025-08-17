import type React from "react"

interface ScoreGaugeProps {
  score: number
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 90) return "var(--chart-1)" // Primary green
    if (s >= 70) return "var(--chart-2)" // Secondary lime
    if (s >= 50) return "var(--chart-4)" // Orange
    return "var(--chart-3)" // Red
  }

  const color = getScoreColor(score)
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full"></div>
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
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          className="drop-shadow-sm"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-6xl font-bold font-[family-name:var(--font-work-sans)]" style={{ color }}>
          {score}
        </span>
        <span className="text-muted-foreground text-base font-medium mt-1">Overall Score</span>
        <div
          className="w-12 h-1 bg-gradient-to-r from-transparent via-current to-transparent mt-2 opacity-30"
          style={{ color }}
        ></div>
      </div>
    </div>
  )
}
