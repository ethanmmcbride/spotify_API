import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define TypeScript types for the expected response
type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
};

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      navigate('/login');
      return;
    }

    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/spotify/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json() as SpotifyTokenResponse;
          
          // Store token and redirect
          localStorage.setItem('spotify_token', data.access_token);
          navigate('/');
        } catch (err) {
          console.error('Token exchange failed:', err);
          navigate('/login');
        }
      };

      exchangeCodeForToken();
    }
  }, [navigate]);

  return <div>Processing Spotify login...</div>;
}