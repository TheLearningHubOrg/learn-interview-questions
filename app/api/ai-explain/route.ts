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

    // Dynamically query available models for this specific API key, or fall back to known priority list
    const fallbackList = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-2.0-flash-exp',
      'gemini-pro'
    ];

    let modelsToTry = fallbackList;

    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available: string[] = (listData.models || [])
          .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''));

        if (available.length > 0) {
          // Sort available models by our preferred priority
          const sorted = fallbackList.filter((m) => available.includes(m));
          // Append any remaining models discovered
          available.forEach((m) => {
            if (!sorted.includes(m)) sorted.push(m);
          });
          modelsToTry = sorted;
        }
      } else {
        const errJson = await listRes.json().catch(() => ({}));
        if (errJson.error?.message) {
          // If the key itself is invalid or has permissions disabled
          return NextResponse.json(
            { 
              error: 'API_KEY_ERROR', 
              message: `Gemini API Key rejected: ${errJson.error.message}. Please get a free API key at https://aistudio.google.com/app/apikey` 
            },
            { status: listRes.status }
          );
        }
      }
    } catch {
      // If list request fails, proceed with fallbackList
    }

    let lastError: string | null = null;
    let candidateText = '';

    for (const model of modelsToTry) {
      // Try v1beta then v1 if needed
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

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

          if (res.ok) {
            const data = await res.json();
            candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (candidateText) {
              return NextResponse.json({ text: candidateText, modelUsed: model });
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            lastError = errData.error?.message || `Gemini API error (${res.status})`;
            // If it's not a 404/not-found error (e.g. rate limit, quota, invalid key), break out
            if (res.status !== 404) {
              break;
            }
          }
        } catch (err: any) {
          lastError = err?.message || 'Network error reaching Gemini API';
        }
      }
    }

    if (candidateText) {
      return NextResponse.json({ text: candidateText });
    }

    return NextResponse.json(
      { 
        error: 'API_ERROR', 
        message: `${lastError || 'Failed to generate response.'} (Tip: Make sure you created a free key on Google AI Studio at https://aistudio.google.com/app/apikey)` 
      },
      { status: 502 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

