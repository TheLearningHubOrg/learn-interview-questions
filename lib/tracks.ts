import fs from 'fs/promises';
import path from 'path';
export * from './tracks-meta';
import { TRACKS, TrackMeta, ParsedQuestion, QuestionViewData, QuestionIndexItem } from './tracks-meta';
import { classifyQuestion } from './question-classifier';

export async function getAllTracks(): Promise<TrackMeta[]> {
  return TRACKS;
}

const LEGACY_SLUG_MAP: Record<string, string> = {
  'angular-ts': 'angular',
  'react-nextjs': 'react',
  'databases': 'sql-databases',
  'devops-kubernetes': 'kubernetes',
  'modern-frameworks': 'vue',
  'vue-nuxt': 'vue',
  'svelte-astro': 'svelte',
  'html-css': 'html',
  'web-vitals-accessibility': 'web-vitals',
  'cicd-gitops': 'cicd',
  'data-warehousing-dbt': 'data-warehousing',
  'messaging-queues': 'rabbitmq',
  'terraform-iac': 'terraform',
  'cloud-gcp-azure': 'gcp',
  'mobile-development': 'react-native',
  'testing-qa-sre': 'software-testing',
  'data-engineering-spark': 'apache-spark',
  'search-vector-databases': 'elasticsearch',
  'linux-os-shell': 'linux-os',
  'design-patterns-ddd': 'design-patterns',
  'html-css-web-vitals': 'html',
  'rust-systems': 'rust',
};

export async function getTrackBySlug(slug: string): Promise<TrackMeta | undefined> {
  const mappedSlug = LEGACY_SLUG_MAP[slug] || slug;
  return TRACKS.find((t) => t.slug === mappedSlug);
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

export function cleanMarkdownText(text: string): string {
  if (!text) return '';
  return text
    // Remove markdown images ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Preserve React/Angular/TS component names in angle brackets like <StrictMode>, <Component>
    .replace(/<([A-Z][A-Za-z0-9_]*)>/g, '$1')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove links but keep link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown bold / italics
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    // Remove inline backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove LaTeX math markers
    .replace(/\$([^$]+)\$/g, '$1')
    // Remove ASCII table / diagram borders
    .replace(/[┌┐└┘├┤┬┴┼─│|]/g, '')
    // Remove leading list / quote markers
    .replace(/^[>\s#*-]+/g, '')
    // Clean up punctuation artifacts (e.g. ,- or :- or ,.)
    .replace(/[:,-]+\s*\./g, '.')
    .replace(/,\s*\./g, '.')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatOneSentence(text: string): string {
  if (!text) return '';
  const match = text.match(/^(.+?[.!?])(?:\s+[A-Z]|\s*$)/);
  let sentence = match ? match[1].trim() : text.trim();

  sentence = sentence.replace(/[:\-–—]\s*$/, '.');
  sentence = sentence.replace(/,\s*$/, '.');
  sentence = sentence.replace(/\.+$/, '.');

  if (!/[.!?]$/.test(sentence)) {
    sentence += '.';
  }

  if (sentence.length > 220) {
    const cut = sentence.slice(0, 217);
    const lastSpace = cut.lastIndexOf(' ');
    sentence = (lastSpace > 120 ? cut.slice(0, lastSpace) : cut) + '...';
  }
  return sentence;
}

export function extractOneLineSummary(content: string, title?: string): string {
  if (!content) return '';

  // 1. Explicit **In Simple Words:** block
  const simpleMatch = content.match(/\*{0,2}In Simple Words:?\*{0,2}\s*([\s\S]*?)(?=\n\s*\n|####|###|\n-|\n\d+\.|$)/i);
  if (simpleMatch && simpleMatch[1]) {
    const cleaned = cleanMarkdownText(simpleMatch[1]);
    if (cleaned.length >= 15) {
      return formatOneSentence(cleaned);
    }
  }

  // 2. High-Yield Candid Answer blockquote (> "...")
  const blockquoteMatch = content.match(/(?:^|\n)>\s*["“]?([^\r\n>]+)/);
  if (blockquoteMatch && blockquoteMatch[1]) {
    const rawQuote = blockquoteMatch[1].replace(/^["“]|["”]$/g, '').trim();
    const cleaned = cleanMarkdownText(rawQuote);
    if (cleaned.length >= 25 && !cleaned.toLowerCase().includes('handbook') && !cleaned.toLowerCase().includes('question bank')) {
      return formatOneSentence(cleaned);
    }
  }

  // 3. Scan lines for the first explanatory narrative paragraph
  const lines = content.split('\n');
  const paragraph: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip headers, horizontal rules, tables, images, details/summary, diagrams
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('---') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('+--') ||
      trimmed.startsWith('┌--')
    ) {
      if (paragraph.length > 0) break;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      if (quoteText.length > 15 && !quoteText.includes('|')) {
        paragraph.push(quoteText);
        break;
      }
      continue;
    }

    if (trimmed.length > 0) {
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        if (paragraph.length === 0) {
          paragraph.push(trimmed.replace(/^[-*]|\d+\.\s*/, ''));
          break;
        }
      } else {
        paragraph.push(trimmed);
        if (trimmed.endsWith('.') || trimmed.endsWith(':') || paragraph.join(' ').length > 150) {
          break;
        }
      }
    } else if (paragraph.length > 0) {
      break;
    }
  }

  const rawText = paragraph.join(' ');
  const cleaned = cleanMarkdownText(rawText);
  if (cleaned.length >= 12) {
    return formatOneSentence(cleaned);
  }

  if (title) {
    const cleanTitle = title.replace(/\?$/, '').trim();
    return formatOneSentence(cleanTitle);
  }

  return '';
}

export function parseTrackQuestionsFromMarkdown(markdown: string, trackSlug?: string): ParsedQuestion[] {
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
        const meta = classifyQuestion({
          trackSlug,
          questionNumber: currentQ.number,
          title: currentQ.title,
          part: currentQ.part,
          content: contentStr,
        });
        const summary = extractOneLineSummary(contentStr, currentQ.title);
        questions.push({
          number: currentQ.number,
          title: currentQ.title,
          part: currentQ.part,
          content: contentStr,
          summary,
          level: meta.level,
          isMostAsked: meta.isMostAsked,
          hasCode: meta.hasCode,
          hasDiagram: meta.hasDiagram,
          tags: meta.tags,
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
          const meta = classifyQuestion({
            trackSlug,
            questionNumber: currentQ.number,
            title: currentQ.title,
            part: currentQ.part,
            content: contentStr,
          });
          const summary = extractOneLineSummary(contentStr, currentQ.title);
          questions.push({
            number: currentQ.number,
            title: currentQ.title,
            part: currentQ.part,
            content: contentStr,
            summary,
            level: meta.level,
            isMostAsked: meta.isMostAsked,
            hasCode: meta.hasCode,
            hasDiagram: meta.hasDiagram,
            tags: meta.tags,
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
    const meta = classifyQuestion({
      trackSlug,
      questionNumber: currentQ.number,
      title: currentQ.title,
      part: currentQ.part,
      content: contentStr,
    });
    const summary = extractOneLineSummary(contentStr, currentQ.title);
    questions.push({
      number: currentQ.number,
      title: currentQ.title,
      part: currentQ.part,
      content: contentStr,
      summary,
      level: meta.level,
      isMostAsked: meta.isMostAsked,
      hasCode: meta.hasCode,
      hasDiagram: meta.hasDiagram,
      tags: meta.tags,
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
  const questions = parseTrackQuestionsFromMarkdown(content, track.slug);
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
        summary: q.summary,
        level: q.level || 'mid',
        isMostAsked: Boolean(q.isMostAsked),
        hasCode: Boolean(q.hasCode),
        hasDiagram: Boolean(q.hasDiagram),
        tags: q.tags || [],
      });
    }
  }

  return items;
}
