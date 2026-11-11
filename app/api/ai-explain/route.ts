import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionTitle, questionContent, mode, customPrompt, userApiKey } = body;

    const apiKey = (userApiKey && typeof userApiKey === 'string' && userApiKey.trim()) 
      ? userApiKey.trim() 
      : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'MISSING_API_KEY',
          message: 'No Google Gemini API key configured. Enter your free Gemini API key below to unlock live AI explanations.' 
        },
        { status: 400 }
      );
    }

    let systemInstruction = '';
    let userPromptText = '';

    if (mode === 'eli5') {
      systemInstruction = 'You are an inspiring technical mentor explaining complex engineering concepts to a beginner. Use an intuitive, memorable real-world analogy. Keep it engaging, formatted with clear markdown sections, and free of unnecessary academic jargon.';
      userPromptText = `Explain the following technical interview concept like I'm 5 years old:\n\nConcept: ${questionTitle}\n\nTechnical Reference:\n${(questionContent || '').slice(0, 3000)}`;
    } else if (mode === 'staff') {
      systemInstruction = 'You are a Principal / Staff Engineer at a top tier tech company (Google/Meta/Stripe). Break down this technical concept from a Staff-plus perspective: production failure modes, concurrency/race conditions, distributed systems trade-offs, and operational telemetry.';
      userPromptText = `Provide a Staff-level architectural deep-dive and trade-off analysis for:\n\nTopic: ${questionTitle}\n\nReference Material:\n${(questionContent || '').slice(0, 3000)}`;
    } else if (mode === 'followups') {
      systemInstruction = 'You are a Bar Raiser Technical Interviewer. Predict the top 3-4 toughest, most insightful follow-up questions an interviewer will ask after the candidate answers this question, along with punchy key points on how to answer each.';
      userPromptText = `Given this interview question and answer:\n\nQuestion: ${questionTitle}\n\nAnswer Summary:\n${(questionContent || '').slice(0, 3000)}\n\nWhat are the top 3-4 interviewer follow-up questions?`;
    } else {
      systemInstruction = 'You are an expert technical interview tutor. Help the user clarify their specific doubt about this interview question. Give a direct, accurate, and practical explanation with concise code examples if helpful.';
      userPromptText = `Topic: ${questionTitle}\n\nContext:\n${(questionContent || '').slice(0, 2000)}\n\nUser Question / Doubt:\n${customPrompt || 'Explain this concept in more depth.'}`;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPromptText}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `Gemini API error (${res.status})`;
      return NextResponse.json({ error: 'API_ERROR', message: errMsg }, { status: res.status });
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';

    return NextResponse.json({ text: candidateText });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

