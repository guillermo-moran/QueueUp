import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminPlayer,
  QueueTable,
  Container,
  Header,
  Card,
  SongTitle,
  SubTitle,
  AddButton,
} from '../components';
import { API_BASE_URL } from '../constants';
import { Song } from '../types';

export const Admin = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin-login');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/admin/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadNowPlaying = async () => {
      const res = await fetch(`${API_BASE_URL}/now`);
      const data = await res.json();
      if (data) setCurrent(data);
    };

    const loadQueue = async () => {
      const res = await fetch(`${API_BASE_URL}/queue`);
      const data = await res.json();
      setQueue(data);
    };

    loadNowPlaying();
    loadQueue();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/events`);

    eventSource.addEventListener('nowPlaying', (e) => {
      const song: Song = JSON.parse(e.data);
      setCurrent((prev) => (!prev || prev.youtubeId !== song.youtubeId ? song : prev));
    });

    eventSource.addEventListener('queueUpdate', (e) => {
      const updatedQueue: Song[] = JSON.parse(e.data);
      setQueue(updatedQueue);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const startPlayback = async () => {
    const res = await fetch(`${API_BASE_URL}/next`, { method: 'POST' });
    const song = await res.json();
    setCurrent(song);
  };

  const deleteSong = async (id: string) => {
    await fetch(`${API_BASE_URL}/queue/${id}`, { method: 'DELETE' });
  };

  return (
    <Container>
      <Header>Admin Dashboard</Header>

      <Card>
        {current ? (
          <>
            <SongTitle>{current.title}</SongTitle>
            <SubTitle>Now Playing</SubTitle>
            <AdminPlayer youtubeId={current.youtubeId} onEnded={startPlayback} />
            <AddButton style={{ marginTop: 12 }} onClick={startPlayback}>
              Skip
            </AddButton>
          </>
        ) : (
          <AddButton onClick={startPlayback}>Start Playback</AddButton>
        )}
      </Card>

      <Card>
        <SongTitle>Queue</SongTitle>
        <QueueTable queue={queue} onDelete={deleteSong} />
      </Card>
    </Container>
  );
};
