import fs from 'fs/promises';
import path from 'path';
export * from './tracks-meta';
import { TRACKS, TrackMeta, ParsedQuestion, QuestionViewData, QuestionIndexItem } from './tracks-meta';

export async function getAllTracks(): Promise<TrackMeta[]> {
  return TRACKS;
}

export async function getTrackBySlug(slug: string): Promise<TrackMeta | undefined> {
  return TRACKS.find((t) => t.slug === slug);
}

export async function getTrackContent(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'tracks', filename);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading track file ${filename}:`, err);
    return '';
  }
}

export function parseTrackQuestionsFromMarkdown(markdown: string): ParsedQuestion[] {
  // Normalize CRLF to LF to prevent regex line-ending match failures
  const cleanMarkdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanMarkdown.split('\n');
  const questions: ParsedQuestion[] = [];
  let currentPart = 'General';
  let currentQ: { number: number; title: string; part: string } | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Part\s+/i.test(line)) {
      if (currentQ) {
        let contentStr = currentContent.join('\n').trim();
        contentStr = contentStr.replace(/\n*---\s*$/, '').trim();
        questions.push({
          number: currentQ.number,
          title: currentQ.title,
          part: currentQ.part,
          content: contentStr,
        });
        currentQ = null;
        currentContent = [];
      }
      currentPart = line.replace(/^##\s+/, '').trim();
      continue;
    } else if (line.startsWith('### ')) {
      const match = line.trimEnd().match(/^### (\d+)\.\s*(.+)$/);
      if (match) {
        if (currentQ) {
          let contentStr = currentContent.join('\n').trim();
          contentStr = contentStr.replace(/\n*---\s*$/, '').trim();
          questions.push({
            number: currentQ.number,
            title: currentQ.title,
            part: currentQ.part,
            content: contentStr,
          });
        }
        currentQ = {
          number: parseInt(match[1], 10),
          title: match[2].trim(),
          part: currentPart,
        };
        currentContent = [];
        continue;
      }
    }
    if (currentQ) {
      currentContent.push(line);
    }
  }

  if (currentQ) {
    let contentStr = currentContent.join('\n').trim();
    contentStr = contentStr.replace(/\n*---\s*$/, '').trim();
    questions.push({
      number: currentQ.number,
      title: currentQ.title,
      part: currentQ.part,
      content: contentStr,
    });
  }

  return questions;
}

const questionsCache = new Map<string, ParsedQuestion[]>();

export async function getTrackQuestions(slug: string): Promise<ParsedQuestion[]> {
  if (questionsCache.has(slug)) {
    return questionsCache.get(slug)!;
  }
  const track = await getTrackBySlug(slug);
  if (!track) return [];
  const content = await getTrackContent(track.filename);
  const questions = parseTrackQuestionsFromMarkdown(content);
  questionsCache.set(slug, questions);
  return questions;
}

export async function getQuestionData(slug: string, questionNumber: number): Promise<QuestionViewData | null> {
  const track = await getTrackBySlug(slug);
  if (!track) return null;

  const questions = await getTrackQuestions(slug);
  const index = questions.findIndex((q) => q.number === questionNumber);
  if (index === -1) return null;

  const currentQ = questions[index];
  const prevQ = index > 0 ? { number: questions[index - 1].number, title: questions[index - 1].title } : null;
  const nextQ = index < questions.length - 1 ? { number: questions[index + 1].number, title: questions[index + 1].title } : null;

  return {
    track,
    question: currentQ,
    allQuestions: questions.map((q) => ({ number: q.number, title: q.title, part: q.part })),
    prevQuestion: prevQ,
    nextQuestion: nextQ,
    totalInTrack: questions.length,
  };
}

export async function getGlobalSearchIndex(): Promise<QuestionIndexItem[]> {
  const items: QuestionIndexItem[] = [];

  for (const track of TRACKS) {
    const questions = await getTrackQuestions(track.slug);
    for (const q of questions) {
      items.push({
        trackSlug: track.slug,
        trackShortTitle: track.shortTitle,
        sectionNumber: track.sectionNumber,
        questionNumber: q.number,
        title: q.title,
        part: q.part,
      });
    }
  }

  return items;
}
