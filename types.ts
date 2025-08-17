
export interface SeoAnalysis {
    overallScore: number;
    onPage: {
      title: SeoFactor;
      metaDescription: SeoFactor;
      headings: {
        h1: string[];
        h2: string[];
        analysis: string;
        score: number;
      };
      imageAlts: {
        analysis: string;
        score: number;
      };
    };
    content: {
      keywordDensity: SeoFactor;
      readability: SeoFactor;
      contentLength: SeoFactor;
    };
    recommendations: string[];
  }
  
  export interface SeoFactor {
    text?: string;
    analysis: string;
    score: number;
  }
  
  export interface GroundingChunk {
    web: {
      uri: string;
      title: string;
    };
  }
  