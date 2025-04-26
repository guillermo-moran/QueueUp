import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

import { handleAdminSetup, handleAdminLogin } from './adminRoutes';
import { loadAdmin, adminData } from './adminAuth';
import { requireAdminAuth } from './requireAdminAuth';

const app = express();
const port = 4000;
const HOST = '0.0.0.0';

const interfaces = os.networkInterfaces();
const address = Object.values(interfaces).flat().find(i => i?.family === 'IPv4' && !i.internal)?.address;

app.use(express.json());

// CORS middleware
app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Simple wrapper for async routes
const wrapAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Admin setup/login
app.post('/admin/setup', wrapAsync(handleAdminSetup));
app.post('/admin/login', wrapAsync(handleAdminLogin));


// Example protected route
app.get('/admin/protected', requireAdminAuth, (req, res) => {
  res.json({ secret: 'This is protected data!' });
});

app.get('/admin/status', (_req, res) => {
  res.json({ hasAdmin: !!adminData });
});

// ----- Your normal jukebox functionality -----

type Song = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
};

type iTunesSearchResult = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
};

type iTunesResponse = {
  resultCount: number;
  results: iTunesSearchResult[];
};

let queue: Song[] = [];
let currentSong: Song | null = null;
let sseClients: Response[] = [];

const sendEvent = (event: string, data: unknown) => {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => client.write(payload));
};

app.get('/', (_req, res) => {
  res.send('🎵 Jukebox server is running!');
});

app.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('event: ping\ndata: {}\n\n');
  sseClients.push(res);
  req.on('close', () => {
    sseClients = sseClients.filter((client) => client !== res);
  });
});

app.get('/queue', (_req, res: Response<Song[]>) => {
  res.json(queue);
});

app.post('/queue', async (req: Request, res: Response) => {
  const { trackName, artistName } = req.body;

  if (!trackName || !artistName) {
    res.status(400).json({ error: 'Missing trackName or artistName' });
    return;
  }

  const query = `${artistName} ${trackName}`;
  try {
    const response = await axios.get<string>(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    const html = response.data;
    const match = html.match(/var ytInitialData = (.*?);<\/script>/);

    if (!match || match.length < 2) {
      res.status(500).json({ error: 'Failed to parse YouTube response' });
      return;
    }

    const ytInitialData = JSON.parse(match[1]);
    const contents = ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents ?? [];
    const video = contents.find((item: any) => item.videoRenderer)?.videoRenderer;

    if (!video || !video.videoId) {
      res.status(404).json({ error: 'No YouTube result found' });
      return;
    }

    const newSong: Song = {
      id: uuidv4(),
      title: video.title.runs[0].text,
      youtubeId: video.videoId,
      thumbnail: `https://i.ytimg.com/vi/${video.videoId}/default.jpg`,
    };

    queue.push(newSong);
    sendEvent('queueUpdate', queue);
    res.status(201).json(newSong);
  } catch (error) {
    console.error('YouTube search failed', error);
    res.status(500).json({ error: 'Failed to search YouTube' });
  }
});

app.delete('/queue/:id', requireAdminAuth, (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  queue = queue.filter((song) => song.id !== id);
  sendEvent('queueUpdate', queue);
  res.sendStatus(204);
});

app.post('/next', requireAdminAuth, (_: Request, res: Response) => {
  currentSong = queue.shift() ?? null;
  sendEvent('nowPlaying', currentSong);
  sendEvent('queueUpdate', queue);
  res.json(currentSong);
});

app.get('/now', (_: Request, res: Response) => {
  res.json(currentSong);
});

app.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter "q"' });
    return;
  }

  try {
    const response = await axios.get<iTunesResponse>('https://itunes.apple.com/search', {
      params: { term: query, media: 'music', limit: 10 },
    });

    const results = response.data.results.map((track: any) => ({
      trackName: track.trackName,
      artistName: track.artistName,
      artworkUrl: track.artworkUrl100,
      genre: track.primaryGenreName,
    }));

    res.json(results);
  } catch (error) {
    console.error('iTunes search failed', error);
    res.status(500).json({ error: 'Failed to fetch from iTunes' });
  }
});

async function startServer() {
  await loadAdmin(); // Load admin credentials first

  app.listen(port, HOST, () => {
    console.log(`🎵 Jukebox backend running at http://localhost:${port}`);
    console.log(`🎵 Jukebox backend running at http://${address}:${port}`);
  });
}

startServer();
