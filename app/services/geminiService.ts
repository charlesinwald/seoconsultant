
import { GoogleGenAI } from "@google/genai";
import { SeoAnalysis, GroundingChunk } from '../../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonResponse = (text: string): SeoAnalysis | null => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]) as SeoAnalysis;
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response:", e);
      return null;
    }
  }
  console.error("No valid JSON block found in the response.");
  return null;
};

export const analyzeSeo = async (url: string, keywords: string): Promise<{ analysis: SeoAnalysis | null, groundingChunks: GroundingChunk[] }> => {
  const hasKeywords = keywords && keywords.trim().length > 0;
  const keywordText = hasKeywords ? ` with a focus on the target keywords: "${keywords}"` : '';
  const keywordInstructions = hasKeywords 
    ? 'keyword usage, and clarity.' 
    : 'and clarity.';
  const keywordDensityInstructions = hasKeywords
    ? 'Analyze the usage and distribution of target keywords. Is it natural or stuffed?'
    : 'Analyze the overall keyword usage and density. Are there natural keyword patterns?';
  const recommendationText = hasKeywords
    ? `improve the site's SEO for the given keywords`
    : `improve the site's SEO performance`;

  const prompt = `
    As an expert SEO analyst, please provide a comprehensive SEO analysis for the website at the URL: ${url}${keywordText}.

    Analyze the following areas and provide a score from 0-100 for each sub-item, where 100 is optimal.
    1.  **On-Page SEO:**
        *   Title Tag: Evaluate its length (50-60 characters is ideal), ${keywordInstructions}
        *   Meta Description: Evaluate its length (150-160 characters is ideal), ${hasKeywords ? 'keyword usage, and' : 'and'} if it contains a compelling call-to-action.
        *   Headings: Check for a single H1, the structure of H2s${hasKeywords ? ', and the use of keywords' : ''}.
        *   Image Alt Texts: Analyze if images likely have descriptive${hasKeywords ? ', keyword-rich' : ''} alt text.
    2.  **Content Analysis:**
        *   Keyword Density: ${keywordDensityInstructions}
        *   Readability: Estimate the content's readability level (e.g., Flesch-Kincaid). Is it appropriate for the target audience?
        *   Content Length: Evaluate if the content seems comprehensive enough for the topic.
    3.  **Overall Score:** Provide an overall SEO score out of 100 based on your complete analysis.
    4.  **Recommendations:** List the top 3-5 most critical and actionable recommendations to ${recommendationText}.

    Your response MUST be a single JSON object inside a markdown code block (\`\`\`json ... \`\`\`). The JSON object must strictly adhere to this structure:
    {
      "overallScore": number,
      "onPage": {
        "title": { "text": string, "analysis": string, "score": number },
        "metaDescription": { "text": string, "analysis": string, "score": number },
        "headings": { "h1": string[], "h2": string[], "analysis": string, "score": number },
        "imageAlts": { "analysis": string, "score": number }
      },
      "content": {
        "keywordDensity": { "analysis": string, "score": number },
        "readability": { "analysis": string, "score": number },
        "contentLength": { "analysis": string, "score": number }
      },
      "recommendations": string[]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from Gemini API");
    }
    
    const analysis = parseJsonResponse(responseText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { analysis, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get SEO analysis from Gemini.");
  }
};
