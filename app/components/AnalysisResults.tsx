import type React from "react"
import type { SeoAnalysis, GroundingChunk } from "../types"
import { ScoreGauge } from "./ScoreGauge"
import { AnalysisCard, ScoreIndicator } from "./AnalysisCard"
import { IconContent, IconHeadings, IconLink, IconThumbsUp, IconTitle } from "./icons"

interface AnalysisResultsProps {
  data: SeoAnalysis
  groundingChunks: GroundingChunk[]
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data, groundingChunks }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center p-8 bg-gradient-to-br from-card/50 to-muted/30 rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
        <ScoreGauge score={data.overallScore} />
        <p className="text-muted-foreground text-center mt-4 max-w-md">
          Your overall SEO score based on on-page optimization, content quality, and technical factors.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <AnalysisCard title="On-Page SEO" icon={<IconTitle />}>
            <div className="space-y-4">
              <FactorAnalysisItem
                title="Title Tag"
                score={data.onPage.title.score}
                analysis={data.onPage.title.analysis}
                text={data.onPage.title.text}
              />
              <FactorAnalysisItem
                title="Meta Description"
                score={data.onPage.metaDescription.score}
                analysis={data.onPage.metaDescription.analysis}
                text={data.onPage.metaDescription.text}
              />
              <FactorAnalysisItem
                title="Image ALTs"
                score={data.onPage.imageAlts.score}
                analysis={data.onPage.imageAlts.analysis}
              />

              <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                    <IconHeadings />
                    Headings
                  </h4>
                  <ScoreIndicator score={data.onPage.headings.score} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{data.onPage.headings.analysis}</p>
                <div className="space-y-2 text-sm">
                  {data.onPage.headings.h1.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-card-foreground">H1:</strong>
                      <span className="font-mono bg-background px-3 py-1 rounded-lg text-xs border border-border/50 flex-1 min-w-0 truncate">
                        {data.onPage.headings.h1[0]}
                      </span>
                    </div>
                  )}
                  {data.onPage.headings.h2.length > 0 && (
                    <div className="text-muted-foreground">
                      <strong>H2 tags found:</strong> {data.onPage.headings.h2.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnalysisCard>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <AnalysisCard title="Content Analysis" icon={<IconContent />}>
            <div className="space-y-4">
              <FactorAnalysisItem
                title="Keyword Density"
                score={data.content.keywordDensity.score}
                analysis={data.content.keywordDensity.analysis}
              />
              <FactorAnalysisItem
                title="Readability"
                score={data.content.readability.score}
                analysis={data.content.readability.analysis}
              />
              <FactorAnalysisItem
                title="Content Length"
                score={data.content.contentLength.score}
                analysis={data.content.contentLength.analysis}
              />
            </div>
          </AnalysisCard>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <AnalysisCard title="Recommendations" icon={<IconThumbsUp />}>
          <div className="space-y-3">
            {data.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-card-foreground leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </AnalysisCard>
      </div>

      {groundingChunks.length > 0 && (
        <div
          className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <IconLink />
            Analysis Sources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groundingChunks.map((chunk, index) => (
              <a
                href={chunk.web.uri}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-background/50 hover:bg-primary/5 rounded-lg border border-border/30 transition-all duration-200 hover:border-primary/30 group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-200">
                  <IconLink />
                </div>
                <span className="text-card-foreground truncate text-sm group-hover:text-primary transition-colors duration-200">
                  {chunk.web.title || chunk.web.uri}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FactorAnalysisItemProps {
  title: string
  score: number
  analysis: string
  text?: string
}

const FactorAnalysisItem: React.FC<FactorAnalysisItemProps> = ({ title, score, analysis, text }) => (
  <div className="p-4 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/40 transition-colors duration-200">
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-semibold text-card-foreground">{title}</h4>
      <ScoreIndicator score={score} />
    </div>
    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{analysis}</p>
    {text && (
      <div className="bg-background/50 p-3 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground mb-1 font-medium">Current content:</p>
        <p className="text-sm font-mono text-card-foreground break-words">"{text}"</p>
      </div>
    )}
  </div>
)
