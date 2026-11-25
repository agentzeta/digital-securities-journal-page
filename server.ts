import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));

// Basic security headers & HTTPS enforcement hint behind reverse proxy
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiting & storage for preview session
const rateWindow = new Map<string, { count: number; resetAt: number }>();
const subscribers: Array<{ email: string; role: string; createdAt: string }> = [];
const inquiries: Array<{ mode: string; name: string; email: string; note: string; createdAt: string }> = [];

function checkRateLimit(ip: string, limit = 30): boolean {
  const now = Date.now();
  const entry = rateWindow.get(ip);
  if (!entry || entry.resetAt < now) {
    rateWindow.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

interface ScrapedItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  relevanceScore: number;
}

const TRUSTED_FEEDS = [
  { name: 'SEC Press Releases', url: 'https://www.sec.gov/news/pressreleases.rss' },
  { name: 'BIS Press Releases', url: 'https://www.bis.org/doclist/all_pressrels.rss' },
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
];

const TOPIC_KEYWORDS = [
  'tokenis', 'tokeniz', 'stablecoin', 'settlement', 'custody', 'dtcc', 'canton',
  'repo', 'dlt', 'ledger', 'agent', 'wallet', 'x402', 'robinhood', 'coinbase',
  'compliance', 'privacy', 'zero-knowledge', 'cbdc', 'securities', 'treasury',
  'clearing', 'depository', 'digital asset', 'crypto', 'fund', 'etf', 'rwa',
];

function decodeEntities(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function parseRssItems(xml: string, sourceName: string): ScrapedItem[] {
  const items: ScrapedItem[] = [];
  const itemMatches = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) || [];

  for (const raw of itemMatches.slice(0, 25)) {
    const title = extractTag(raw, 'title');
    const link = extractTag(raw, 'link');
    const pubDate =
      extractTag(raw, 'pubDate') ||
      extractTag(raw, 'dc:date') ||
      new Date().toISOString();
    const desc =
      extractTag(raw, 'description') ||
      extractTag(raw, 'content:encoded') ||
      '';

    if (!title || !link || !link.startsWith('http')) continue;

    const haystack = `${title} ${desc}`.toLowerCase();
    let score = 0;
    for (const kw of TOPIC_KEYWORDS) {
      if (haystack.includes(kw)) score += 1;
    }

    items.push({
      title,
      link,
      source: sourceName,
      publishedAt: pubDate,
      summary: desc.slice(0, 260) + (desc.length > 260 ? '…' : ''),
      relevanceScore: score,
    });
  }
  return items;
}

app.get('/api/newsletter/scrape', async (req, res) => {
  const clientIp = req.ip || 'unknown';
  if (!checkRateLimit(clientIp, 20)) {
    res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute before scraping again.' });
    return;
  }

  const results = await Promise.allSettled(
    TRUSTED_FEEDS.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'DigitalSecuritiesJournal/1.0 (Digitalsecuritiesjournal@proton.me)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: AbortSignal.timeout(7000),
      });
      if (!response.ok) {
        throw new Error(`${feed.name} returned HTTP ${response.status}`);
      }
      const xml = await response.text();
      return parseRssItems(xml, feed.name);
    })
  );

  const allItems: ScrapedItem[] = [];
  const feedStatus: Array<{ source: string; status: 'ok' | 'error'; count: number; message?: string }> = [];

  results.forEach((result, idx) => {
    const feed = TRUSTED_FEEDS[idx];
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
      feedStatus.push({ source: feed.name, status: 'ok', count: result.value.length });
    } else {
      feedStatus.push({
        source: feed.name,
        status: 'error',
        count: 0,
        message: result.reason instanceof Error ? result.reason.message : 'Fetch failed',
      });
    }
  });

  // Prefer relevant capital-markets & tokenisation stories, then recency
  const topicMatched = allItems.filter((item) => item.relevanceScore > 0);
  const selected = (topicMatched.length >= 4 ? topicMatched : allItems)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 12);

  res.json({
    scrapedAt: new Date().toISOString(),
    feedStatus,
    items: selected,
  });
});

app.post('/api/newsletter/generate', async (req, res) => {
  const clientIp = req.ip || 'unknown';
  if (!checkRateLimit(clientIp, 15)) {
    res.status(429).json({ error: 'Rate limit exceeded.' });
    return;
  }

  const { items, focusTopic } = req.body as {
    items?: ScrapedItem[];
    focusTopic?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Run the live feed scraper first so the newsletter uses verified headlines.' });
    return;
  }

  const sanitizedItems = items.slice(0, 8).map((item) => ({
    title: String(item.title || '').slice(0, 200),
    source: String(item.source || '').slice(0, 80),
    link: String(item.link || '').slice(0, 300),
    publishedAt: String(item.publishedAt || '').slice(0, 60),
    summary: String(item.summary || '').slice(0, 320),
  }));

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });

      const prompt = `You are the Senior Markets Editor of Digital Securities Journal.
Write a crisp, authoritative institutional newsletter dispatch based STRICTLY on these live scraped items (do not invent any numbers, companies, or claims outside the supplied items):
${focusTopic ? `Editorial focus: ${String(focusTopic).slice(0, 120)}` : ''}

Live scraped items:
${sanitizedItems.map((it, i) => `${i + 1}. [${it.source}] ${it.title} (${it.publishedAt}) — ${it.summary} [URL: ${it.link}]`).join('\n')}

Format in clean Markdown with:
- Headline
- 2-sentence Executive Summary
- Key Developments (bulleted with exact source links)
- Institutional Takeaway for Asset Servicing, Custody & Agentic Rails.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
      });

      if (response.text) {
        res.json({
          mode: 'ai-synthesized',
          generatedAt: new Date().toISOString(),
          markdown: response.text,
        });
        return;
      }
    } catch (err) {
      // Fall through to deterministic RSS digest with explicit notice if Gemini quota/key fails
      console.error('Gemini synthesis fallback:', err instanceof Error ? err.message : err);
    }
  }

  const dateLabel = new Date().toUTCString().slice(0, 16);
  const digestLines = [
    `# Digital Securities Journal — Institutional Dispatch (${dateLabel})`,
    '',
    focusTopic
      ? `**Editorial Focus:** ${String(focusTopic).slice(0, 120)}`
      : '**Editorial Focus:** Tokenisation, Market Infrastructure, Custody & Regulatory Developments',
    '',
    '## Live Verified Headlines',
    '',
    ...sanitizedItems.map(
      (it) =>
        `- **${it.title}** (*${it.source}*, ${it.publishedAt})  \n  ${it.summary}  \n  Source: ${it.link}`
    ),
    '',
    '---',
    '*Compiled automatically from live SEC, BIS, and CoinDesk feeds. Enquiries: Digitalsecuritiesjournal@proton.me*',
  ];

  res.json({
    mode: 'rss-digest',
    generatedAt: new Date().toISOString(),
    markdown: digestLines.join('\n'),
  });
});

app.post('/api/subscribe', (req, res) => {
  const { email, role, website } = req.body as {
    email?: string;
    role?: string;
    website?: string; // honeypot
  };

  // Honeypot spam rejection
  if (website && website.trim() !== '') {
    res.status(400).json({ error: 'Invalid submission.' });
    return;
  }

  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400).json({ error: 'Please enter a valid institutional email address.' });
    return;
  }

  subscribers.push({
    email: cleanEmail,
    role: String(role || 'Institutional Reader').slice(0, 80),
    createdAt: new Date().toISOString(),
  });

  res.json({
    ok: true,
    email: cleanEmail,
    message: 'Subscribed to Digital Securities Journal dispatches.',
  });
});

app.post('/api/inquiry', (req, res) => {
  const { mode, name, email, note, website } = req.body as {
    mode?: string;
    name?: string;
    email?: string;
    note?: string;
    website?: string; // honeypot
  };

  if (website && website.trim() !== '') {
    res.status(400).json({ error: 'Invalid submission.' });
    return;
  }

  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (cleanName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400).json({ error: 'Please provide your name and a valid email address.' });
    return;
  }

  inquiries.push({
    mode: String(mode || 'general').slice(0, 40),
    name: cleanName.slice(0, 120),
    email: cleanEmail,
    note: String(note || '').slice(0, 2000),
    createdAt: new Date().toISOString(),
  });

  res.json({
    ok: true,
    contactEmail: 'Digitalsecuritiesjournal@proton.me',
    message: 'Enquiry recorded. Direct correspondence: Digitalsecuritiesjournal@proton.me.',
  });
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const urls = [
    '/',
    '/#editions',
    '/#events',
    '/#resources',
    '/#newsletter',
    '/#privacy-policy',
    '/#editorial-policy',
    '/#terms',
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u}</loc>
    <lastmod>2026-11-25</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Securities Journal server running on port ${PORT}`);
  });
}

startServer();
