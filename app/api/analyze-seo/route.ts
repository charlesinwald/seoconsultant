import { NextRequest, NextResponse } from 'next/server';
import { analyzeSeo } from '../../services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { url, keywords } = await request.json();
    
    if (!url || !keywords) {
      return NextResponse.json(
        { error: 'URL and keywords are required' },
        { status: 400 }
      );
    }

    const result = await analyzeSeo(url, keywords);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analyze-seo API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze SEO' },
      { status: 500 }
    );
  }
}