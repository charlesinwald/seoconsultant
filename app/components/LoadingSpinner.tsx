import type React from "react"

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-border rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xl font-semibold text-foreground mb-3">Analyzing your website...</p>
        <p className="text-base text-foreground/70">This may take a few moments</p>
      </div>
    </div>
  )
}
