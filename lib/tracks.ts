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
  'data-warehousing-dbt': 'snowflake',
  'data-warehousing': 'snowflake',
  'java-spring': 'java',
  'spring': 'spring-boot',
  'dotnet-csharp': 'csharp',
  'c-sharp': 'csharp',
  'dotnet': 'aspnet-core',
  'aspnet': 'aspnet-core',
  'php-laravel': 'php',
  'ios-swift': 'swift',
  'android-kotlin': 'kotlin',
  'solid': 'solid-principles',
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

function formatBulletsToInline(text: string): string {
  const lines = text.split('\n');
  const introParts: string[] = [];
  const bulletParts: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('---') || line.startsWith('#') || line.startsWith('|') || line.startsWith('```')) {
      break;
    }

    const isBullet = line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s+/.test(line);
    if (isBullet) {
      const cleanBullet = cleanMarkdownText(line.replace(/^[-*]\s+|\d+\.\s+/, ''));
      if (cleanBullet.length > 3) {
        // Protect dots in versions, numbers, and identifiers (e.g. 5.0, Node.js, fs.readFile)
        const safeBullet = cleanBullet
          .replace(/\b(e\.g\.|i\.e\.|etc\.|vs\.|v[0-9]+\.)/gi, (m) => m.replace(/\./g, '___DOT___'))
          .replace(/([a-zA-Z0-9_$])\.([a-zA-Z0-9_$])/g, '$1___DOT___$2');

        const match = safeBullet.match(/^(.*?[.!?])(?:\s+|$)/);
        let itemText = (match ? match[1] : safeBullet).replace(/___DOT___/g, '.');

        if (itemText.length > 150) {
          const cut = itemText.slice(0, 145);
          const space = cut.lastIndexOf(' ');
          itemText = (space > 50 ? cut.slice(0, space) : cut);
        }
        itemText = itemText.replace(/[:,\-–—.]\s*$/, '').trim();
        bulletParts.push(itemText);
      }
    } else if (bulletParts.length === 0) {
      const cleanIntro = cleanMarkdownText(line);
      if (cleanIntro.length > 5) {
        introParts.push(cleanIntro);
      }
    }
  }

  const intro = introParts.join(' ').replace(/[:,\-–—]\s*$/, '').trim();
  const uselessLeadIns = [
    /(below are|the following are|here are|there are|consists of the following|consists of|has the following|key components below|components below|below classes|as follows|list of|these include|following is the list|are shown below)/i
  ];
  const isUselessIntro = uselessLeadIns.some(rgx => rgx.test(intro));

  if (bulletParts.length > 0) {
    const topBullets = bulletParts.slice(0, 4).join(' • ');
    if (intro && !isUselessIntro) {
      return `${intro}: ${topBullets}.`;
    }
    return `${topBullets}.`;
  }

  return intro;
}

export function formatOneSentence(text: string, maxChars = 340): string {
  if (!text) return '';
  const cleaned = cleanMarkdownText(text);

  // Protect common abbreviations, initials, and identifier dots
  const protectedText = cleaned
    .replace(/\b(e\.g\.|i\.e\.|etc\.|vs\.|al\.|approx\.|min\.|max\.|Mr\.|Dr\.|v[0-9]+\.)/gi, (m) => m.replace(/\./g, '___DOT___'))
    .replace(/\b([A-Z])\.\s+([A-Z])/g, '$1___DOT___ $2')
    .replace(/([a-zA-Z0-9_$])\.([a-zA-Z0-9_$])/g, '$1___DOT___$2');

  if (protectedText.length <= maxChars) {
    let result = protectedText.replace(/___DOT___/g, '.').replace(/[:,\-–—]\s*$/, '').trim();
    result = result.replace(/\.+$/, '.');
    if (!/[.!?]$/.test(result)) result += '.';
    return result;
  }

  if (protectedText.includes(' • ')) {
    const bullets = protectedText.split(' • ');
    let bulletAcc = '';
    for (const b of bullets) {
      const candidate = bulletAcc ? `${bulletAcc} • ${b}` : b;
      if (candidate.length <= maxChars) {
        bulletAcc = candidate;
      } else {
        break;
      }
    }
    if (bulletAcc.length >= 80) {
      let result = bulletAcc.replace(/___DOT___/g, '.').replace(/[:,\-–—]\s*$/, '').trim();
      result = result.replace(/\.+$/, '.');
      if (!/[.!?]$/.test(result)) result += '.';
      return result;
    }
  }

  const sentences = protectedText.split(/(?<=[.!?])\s+/);
  let accumulated = '';
  for (const s of sentences) {
    if ((accumulated + ' ' + s).trim().length <= maxChars) {
      accumulated = (accumulated + ' ' + s).trim();
    } else {
      break;
    }
  }

  if (accumulated.length >= 100) {
    let result = accumulated.replace(/___DOT___/g, '.').trim();
    result = result.replace(/\.+$/, '.');
    if (!/[.!?]$/.test(result)) result += '.';
    return result;
  }

  const cut = protectedText.slice(0, maxChars - 3);
  const lastSpace = cut.lastIndexOf(' ');
  const safeCut = (lastSpace > 140 ? cut.slice(0, lastSpace) : cut);
  let result = safeCut.replace(/___DOT___/g, '.').replace(/[,:;\-–—]\s*$/, '').trim() + '...';
  return result;
}

export function extractOneLineSummary(content: string, title?: string): string {
  if (!content) return '';

  // 1. Explicit **In Simple Words:** block
  const simpleMatch = content.match(/\*{0,2}In Simple Words:?\*{0,2}\s*([\s\S]*?)(?=\n\s*---|(?:\n\s*###\s+\d+)|\n\s*```|\n\s*\||$)/i);
  if (simpleMatch && simpleMatch[1]) {
    // Strip internal subheaders like #### Top Causes:
    const rawBlock = simpleMatch[1].replace(/####[^\n]*\n/g, '').trim();
    if (/^\s*[-*]\s|\n\s*[-*]\s|^\s*\d+\.\s|\n\s*\d+\.\s/m.test(rawBlock)) {
      const bulletSummary = formatBulletsToInline(rawBlock);
      if (bulletSummary && bulletSummary.length >= 15) {
        return formatOneSentence(bulletSummary);
      }
    } else {
      const cleaned = cleanMarkdownText(rawBlock);
      if (cleaned.length >= 15) {
        return formatOneSentence(cleaned);
      }
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

  // 3. Scan first explanatory narrative paragraph / list
  const lines = content.split('\n');
  const collectedLines: string[] = [];
  let inCodeBlock = false;
  let isLeadIn = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('---') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('+--') ||
      trimmed.startsWith('┌--') ||
      /^\*{0,2}In Simple Words:?\*{0,2}$/i.test(trimmed)
    ) {
      if (collectedLines.length > 0) break;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      if (quoteText.length > 15 && !quoteText.includes('|')) {
        collectedLines.push(quoteText);
        break;
      }
      continue;
    }

    if (trimmed.length > 0) {
      collectedLines.push(trimmed);
      isLeadIn = /(:|,|below|following|are|include|consists of)$/i.test(trimmed) || collectedLines.join(' ').length < 60;
      if (collectedLines.join('\n').length > 500) break;
    } else if (collectedLines.length > 0) {
      let nextIsList = false;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextTrimmed = lines[j].trim();
        if (nextTrimmed.length > 0) {
          if (nextTrimmed.startsWith('- ') || nextTrimmed.startsWith('* ') || /^\d+\.\s+/.test(nextTrimmed)) {
            nextIsList = true;
          }
          break;
        }
      }
      if (isLeadIn && nextIsList) {
        continue;
      } else {
        break;
      }
    }
  }

  const rawSection = collectedLines.join('\n');
  if (/^\s*[-*]\s|\n\s*[-*]\s|^\s*\d+\.\s|\n\s*\d+\.\s/m.test(rawSection)) {
    const bulletSummary = formatBulletsToInline(rawSection);
    if (bulletSummary && bulletSummary.length >= 15) {
      return formatOneSentence(bulletSummary);
    }
  }

  const cleaned = cleanMarkdownText(rawSection);
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
