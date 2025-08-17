"use client"
import { useState } from "react"
import { SeoForm } from "./components/SeoForm"
import { AnalysisResults } from "./components/AnalysisResults"
import { LoadingSpinner } from "./components/LoadingSpinner"
import type { SeoAnalysis, GroundingChunk } from "../types"

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysis | null>(null)
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleAnalysis = async (url: string, keywords: string) => {
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)
    setGroundingChunks([])

    try {
      const response = await fetch("/api/analyze-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, keywords }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze SEO")
      }

      const { analysis, groundingChunks } = await response.json()
      if (analysis) {
        setAnalysisResult(analysis)
        setGroundingChunks(groundingChunks)
      } else {
        setError("Failed to parse the SEO analysis. The AI response might be in an unexpected format.")
      }
    } catch (e) {
      setError("An error occurred while analyzing the URL. Please check the console for details.")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>

      <main className="relative max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 font-[family-name:var(--font-work-sans)]">
            SEO <span className="text-primary">Analyzer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get comprehensive SEO insights powered by AI. Analyze your website&apos;s performance and discover optimization
            opportunities.
          </p>
        </header>

        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <SeoForm onSubmit={handleAnalysis} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="animate-scale-in">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="mb-8 p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center animate-scale-in backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold">Analysis Failed</h3>
            </div>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <AnalysisResults data={analysisResult} groundingChunks={groundingChunks} />
          </div>
        )}

        <footer className="text-center mt-16 pt-8 border-t border-border/50">
          <p className="text-muted-foreground text-sm">
            Powered by Google Gemini • Analysis results are AI-generated and may not be 100% accurate
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
