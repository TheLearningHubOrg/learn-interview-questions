export type AiExplainMode = 'simple' | 'key_points' | 'followups' | 'custom';

export interface AiExplainRequest {
  questionTitle: string;
  questionContent: string;
  mode: AiExplainMode;
  customPrompt?: string;
  userApiKey?: string;
}

export type AiExplainResult =
  | { ok: true; text: string; modelUsed?: string }
  | { ok: false; needsApiKey: boolean; message: string };

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash-exp',
  'gemini-pro',
];

function buildPrompts(
  questionTitle: string,
  questionContent: string,
  mode: AiExplainMode,
  customPrompt?: string
) {
  if (mode === 'simple') {
    return {
      systemInstruction:
        'You are an inspiring technical mentor explaining complex engineering concepts simply and clearly. Break down the concept in plain English with an intuitive everyday analogy. Structure your answer in 3 clean markdown sections:\n\n### 💡 Plain English Summary\n2-3 crystal-clear sentences that anyone can grasp immediately.\n\n### 🍎 Everyday Analogy\nA memorable, real-world comparison that makes the concept click instantly.\n\n### 🎙️ How to Answer in an Interview\n3 punchy, complete bullet points ready to speak out loud in an interview.\n\nAlways ensure every bullet point and sentence is 100% complete and never cut off.',
      userPromptText: `Explain this concept simply:\n\nQuestion: ${questionTitle}\n\nTechnical Reference:\n${(questionContent || '').slice(0, 3000)}`,
    };
  }

  if (mode === 'key_points') {
    return {
      systemInstruction:
        'You are a senior tech lead. Summarize the essential engineering takeaways, practical gotchas, and production trade-offs in clean bullet points for an interview candidate:\n\n### ⚡ Core Takeaways\n3-4 essential technical facts you must know.\n\n### ⚠️ Common Pitfalls & Mistakes\nTop 2-3 mistakes engineers make and how to avoid them.\n\n### ⚖️ Production Trade-offs\nWhen to use this approach vs alternatives in real systems.\n\nAlways finish all thoughts and sentences completely.',
      userPromptText: `Provide key takeaways and trade-offs for:\n\nTopic: ${questionTitle}\n\nTechnical Reference:\n${(questionContent || '').slice(0, 3000)}`,
    };
  }

  if (mode === 'followups') {
    return {
      systemInstruction:
        'You are a Bar Raiser Technical Interviewer. Predict the top 3 toughest, most insightful follow-up questions an interviewer will ask after this question, with winning answers:\n\nFormat each follow-up with:\n### 1. [Follow-up Question Title]\n**What they test:** 1 sentence.\n**Winning Answer:** 2-3 punchy bullet points.\n\nAlways finish each question and answer completely.',
      userPromptText: `Interview Question: ${questionTitle}\n\nAnswer Summary:\n${(questionContent || '').slice(0, 3000)}\n\nWhat are the top 3 interviewer follow-up questions?`,
    };
  }

  return {
    systemInstruction:
      'You are a helpful, clear technical interview tutor. Help the user clarify their specific doubt about this interview question. Give a direct, accurate, and practical explanation with concise code examples if helpful. Keep it concise, friendly, and complete without cutting off.',
    userPromptText: `Topic: ${questionTitle}\n\nContext:\n${(questionContent || '').slice(0, 2000)}\n\nUser Question / Doubt:\n${customPrompt || 'Explain this concept in more depth.'}`,
  };
}

/** Generate an AI explanation via an optional configured backend URL or directly with the user's Gemini API key. */
export async function generateAiExplanation(req: AiExplainRequest): Promise<AiExplainResult> {
  const externalApiUrl = (process.env.NEXT_PUBLIC_AI_EXPLAIN_API_URL || '').trim();
  const apiKey = (req.userApiKey || '').trim();

  if (externalApiUrl) {
    try {
      const res = await fetch(externalApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (res.ok && data?.text) {
        return { ok: true, text: data.text, modelUsed: data.modelUsed };
      }
      if (data?.error === 'MISSING_API_KEY') {
        return { ok: false, needsApiKey: true, message: data.message };
      }
      return {
        ok: false,
        needsApiKey: false,
        message: data?.message || 'Failed to generate explanation',
      };
    } catch (err: any) {
      if (!apiKey) {
        return {
          ok: false,
          needsApiKey: false,
          message: err?.message || 'Network error reaching AI backend.',
        };
      }
    }
  }

  if (!apiKey) {
    return {
      ok: false,
      needsApiKey: true,
      message:
        'No Google Gemini API key configured. Enter your free Gemini API key below to unlock live AI explanations.',
    };
  }

  const { systemInstruction, userPromptText } = buildPrompts(
    req.questionTitle,
    req.questionContent,
    req.mode,
    req.customPrompt
  );

  let modelsToTry = FALLBACK_MODELS;

  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    if (listRes.ok) {
      const listData = await listRes.json();
      const available: string[] = (listData.models || [])
        .filter(
          (m: any) =>
            Array.isArray(m.supportedGenerationMethods) &&
            m.supportedGenerationMethods.includes('generateContent')
        )
        .map((m: any) => m.name.replace(/^models\//, ''));

      if (available.length > 0) {
        const sorted = FALLBACK_MODELS.filter((m) => available.includes(m));
        for (const m of available) {
          if (!sorted.includes(m)) sorted.push(m);
        }
        modelsToTry = sorted;
      }
    } else {
      const errJson = await listRes.json().catch(() => ({}));
      if (errJson.error?.message) {
        return {
          ok: false,
          needsApiKey: false,
          message: `Gemini API Key rejected: ${errJson.error.message}. Please get a free API key at https://aistudio.google.com/app/apikey`,
        };
      }
    }
  } catch {
    // Fall back to default model priority list
  }

  let lastError: string | null = null;

  for (const model of modelsToTry) {
    for (const apiVersion of ['v1beta', 'v1']) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\n${userPromptText}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (candidateText) {
            return { ok: true, text: candidateText, modelUsed: model };
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData.error?.message || `Gemini API error (${res.status})`;
          if (res.status !== 404) {
            break;
          }
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error reaching Gemini API';
      }
    }
  }

  return {
    ok: false,
    needsApiKey: false,
    message: `${lastError || 'Failed to generate response.'} (Tip: Make sure you created a free key on Google AI Studio at https://aistudio.google.com/app/apikey)`,
  };
}
