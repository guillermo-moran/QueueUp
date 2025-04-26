import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  Card,
  SearchInput,
  AddButton,
  FeedbackCard,
} from '../components';
import { API_BASE_URL } from '../constants';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/status`);
        const { hasAdmin } = await res.json();
        setMode(hasAdmin ? 'login' : 'setup');
      } catch (err) {
        console.error('Failed to fetch admin status', err);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSubmit = async () => {
    if (!username || !password) {
      setFeedback('Please enter username and password.');
      return;
    }

    try {
      const endpoint = mode === 'login' ? 'login' : 'setup';
      const res = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        setFeedback(error.error || 'Authentication failed.');
        return;
      }

      const data = await res.json();
      if (data.token) {
        console.log("TOKEN: ", data.token);
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setFeedback('Authentication failed.');
      }
    } catch (err) {
      console.error('Login/setup failed', err);
      setFeedback('Something went wrong.');
    }
  };

  return (
    <Container>
      <Header>{mode === 'login' ? 'Admin Login' : 'Create Admin Account'}</Header>

      {feedback && <FeedbackCard>{feedback}</FeedbackCard>}

      <Card>
        <SearchInput
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <SearchInput
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AddButton onClick={handleSubmit}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </AddButton>
      </Card>
    </Container>
  );
};
