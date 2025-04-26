import { useEffect, useRef } from 'react';

type AdminPlayerProps = {
  youtubeId: string;
  onEnded: () => void;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const AdminPlayer = ({ youtubeId, onEnded }: AdminPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const currentVideoId = useRef<string | null>(null);

  // Load YouTube API once
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }, []);

  // Create player and handle updates
  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;

      // If player exists
      if (playerRef.current) {
        if (currentVideoId.current !== youtubeId) {
          playerRef.current.loadVideoById(youtubeId);
          currentVideoId.current = youtubeId;
        }
        return;
      }

      // First time creation
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.unMute();
            event.target.playVideo();
            currentVideoId.current = youtubeId;
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnded();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [youtubeId, onEnded]);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
};
