import 'dotenv/config';
import dns from 'dns';
// ISP DNS blocks SRV queries needed by mongodb+srv:// — force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = Number(process.env.PORT || 10000);
const mongoUri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB || 'kaalyug';
const origins = (process.env.FRONTEND_ORIGIN || '*').split(',').map(value => value.trim()).filter(Boolean);
let client;
let messages;
let databaseStatus = 'disconnected';
let databaseError = null;

// Yug AI — Gemini setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YUG_AI_CONTEXT = `# KAALYUG OS — SYSTEM ARCHITECTURE & AI KNOWLEDGE BASE
[SYSTEM_SPECIFICATIONS]
OS Name: Kaalyug OS
Version: 2.0.0 LTS (Web Kernel)
Architecture: x86_64 Virtual Web Environment
Environment: React 19 + Express + MongoDB Atlas + Gemini AI Engine

[KEYBOARD_SHORTCUTS]
Spotlight Search: Ctrl + K (or Cmd + K)
Lock Screen: Ctrl + L (or Cmd + L)
Escape: Dismiss search, notifications, or dialogs

[APPLICATIONS]
1. Terminal: POSIX-compatible shell with commands (help, neofetch, top, ls, cat, touch, rm, clear, sysinfo, date, echo, calc, open).
2. Notes: Full markdown & text editor with local file saving.
3. Calculator: Interactive scientific & standard calculator.
4. Activity Monitor: Live system processes, CPU & memory stats.
5. Finder / Files: Virtual File System browser with documents and files.
6. Browser: Embedded web browser and URL runner.
7. Yug AI: Native conversational intelligence engine.
8. Yug Chat: Global real-time community chat.
9. Settings: Appearance, themes (Dark, Blue, Pink), system preferences.
10. Snake: Arcade retro game.
`;
const YUG_AI_SYSTEM = `You are Yug AI, the native AI assistant and intelligence core of Kaalyug OS.

You are friendly, knowledgeable, concise, and helpful. You assist users with using Kaalyug OS, coding in any programming language, solving math and logic problems, answering general knowledge and technology questions, and general friendly conversation.

SYSTEM CONTEXT:
${YUG_AI_CONTEXT}`;

app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json({ limit: '20kb' }));

async function connectDatabase() {
  if (!mongoUri || /PASTE_|YOUR_/i.test(mongoUri)) throw new Error('MONGODB_URI is missing or still a placeholder');
  client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db(databaseName);
  await db.command({ ping: 1 });
  messages = db.collection('messages');
  await messages.createIndex({ createdAt: -1 });
  databaseStatus = 'connected';
  databaseError = null;
  console.log(`MongoDB connected: database=${databaseName}`);
}

app.get('/', (_req, res) => res.json({
  service: 'Kaalyug OS Backend API',
  status: 'online',
  version: '2.0.0',
  database: databaseStatus,
  endpoints: {
    health: '/health',
    chat: 'POST /api/chat',
    messages: 'GET,POST /api/messages'
  }
}));

app.get('/health', (_req, res) => res.status(200).json({
  ok: databaseStatus === 'connected',
  service: 'kaalyug-chat',
  database: databaseStatus,
  error: databaseError
}));

// Yug AI chat endpoint — with retry for transient 503s
app.post('/api/chat', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 1000);
  if (!question) return res.status(400).json({ error: 'Question is required.' });
  if (!GEMINI_API_KEY) return res.status(503).json({ error: 'Yug AI is not configured. Set GEMINI_API_KEY in .env.' });

  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 1500;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        systemInstruction: YUG_AI_SYSTEM,
      });
      const result = await model.generateContent(question);
      const answer = result.response.text();
      return res.json({ answer });
    } catch (error) {
      const is503 = error.message && error.message.includes('503');
      console.error(`Gemini attempt ${attempt} failed:`, error.message);
      if (attempt < MAX_RETRIES && is503) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return res.status(503).json({
        error: 'Yug AI is temporarily unavailable. Please try again in a moment.',
        details: error.message,
      });
    }
  }
});

app.get('/api/messages', async (_req, res) => {
  if (!messages) return res.status(503).json({ error: 'MongoDB is not connected.', details: databaseError });
  try { res.json((await messages.find({}).sort({ createdAt: -1 }).limit(100).toArray()).reverse()); }
  catch (error) { res.status(503).json({ error: 'Unable to read messages.', details: error.message }); }
});

app.post('/api/messages', async (req, res) => {
  const user = String(req.body?.user || '').trim().slice(0, 40);
  const text = String(req.body?.text || '').trim().slice(0, 2000);
  if (!user || !text) return res.status(400).json({ error: 'Username and message are required.' });
  if (!messages) return res.status(503).json({ error: 'MongoDB is not connected.', details: databaseError });
  try { const message = { user, text, createdAt: new Date() }; const result = await messages.insertOne(message); res.status(201).json({ ...message, _id: result.insertedId }); }
  catch (error) { res.status(503).json({ error: 'Unable to save message.', details: error.message }); }
});

app.listen(port, async () => {
  console.log(`Kaalyug backend listening on http://localhost:${port}`);
  try { await connectDatabase(); }
  catch (error) { databaseStatus = 'error'; databaseError = error.message; console.error(`MongoDB connection failed: ${error.message}`); }
});
