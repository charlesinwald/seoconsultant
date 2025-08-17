import type React from "react"

interface AnalysisCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 flex items-center gap-4 border-b border-border/30">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{icon}</div>
        <h3 className="text-xl font-bold text-card-foreground font-[family-name:var(--font-work-sans)]">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

interface ScoreIndicatorProps {
  score: number
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score }) => {
  const getScoreStyles = (s: number) => {
    if (s >= 90) return "bg-chart-1 text-white"
    if (s >= 70) return "bg-chart-2 text-white"
    if (s >= 50) return "bg-chart-4 text-white"
    return "bg-chart-3 text-white"
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-4 py-2 text-sm font-bold rounded-full shadow-sm ${getScoreStyles(score)} transition-all duration-200`}
      >
        {score}/100
      </span>
    </div>
  )
}
