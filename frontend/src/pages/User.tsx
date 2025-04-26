import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants';
import { 
  Container, 
  Header, 
  FeedbackCard, 
  Card, 
  NowPlayingTitle, 
  NowPlayingInfo, 
  SearchInput, 
  NowPlayingThumbnail, 
  SongTitle, 
  ResultCard, 
  SubTitle, 
  ResultThumbnail, 
  ResultText, 
  AddButton 
} from '../components';
import { Song, Track } from '../types';


export const User = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [feedback, setFeedback] = useState('');


  const search = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setResults([]); // Clear old results before making a new request

    try {
      const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };


  const addToQueue = async (track: Track) => {
    await fetch(`${API_BASE_URL}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackName: track.trackName,
        artistName: track.artistName,
      }),
    });

    setFeedback(`Added to queue: ${track.trackName} – ${track.artistName}`);
    setTimeout(() => setFeedback(''), 3000);
  };

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await fetch(`${API_BASE_URL}/now`);
      const data = await res.json();
      if (data) setNowPlaying(data);
    };

    fetchNowPlaying();

    const eventSource = new EventSource(`${API_BASE_URL}/events`);
    eventSource.addEventListener('nowPlaying', (e) => {
      const song: Song = JSON.parse(e.data);
      setNowPlaying(song);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Container>
      <Header>Jukebox</Header>
      {feedback && <FeedbackCard>{feedback}</FeedbackCard>}
      {nowPlaying && (
        <Card>
          <NowPlayingTitle>Now Playing</NowPlayingTitle>
          <NowPlayingInfo>
            <NowPlayingThumbnail src={nowPlaying.thumbnail} alt={nowPlaying.title} />
            <div>
              <SongTitle>{nowPlaying.title}</SongTitle>
              <SubTitle>Now Playing</SubTitle>
            </div>
          </NowPlayingInfo>
        </Card>
      )}

      <Card>
        <SearchInput
          placeholder="Search for music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />

        {results.map((track) => (
          <ResultCard key={`${track.artistName}-${track.trackName}`}>
            <ResultThumbnail src={track.artworkUrl} alt={track.trackName} />
            <ResultText>
              <div style={{ fontWeight: 600 }}>{track.trackName}</div>
              <SubTitle>{track.artistName}</SubTitle>
            </ResultText>
            <AddButton onClick={() => addToQueue(track)}>Add</AddButton>
          </ResultCard>
        ))}
      </Card>
    </Container>
  );
};
