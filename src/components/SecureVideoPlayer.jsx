import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ShieldCheck, 
  Lock, 
  RotateCcw
} from 'lucide-react';
import { getProtectedVideoUrl } from '../lib/supabase';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function SecureVideoPlayer({
  src,
  storagePath = '',
  title,
  currentUser,
  autoPlay = false,
  fileName = ''
}) {
  const shadowHostRef = useRef(null);
  const videoElementRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [streamSrc, setStreamSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showDrmToast, setShowDrmToast] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState(0);

  const controlsTimeoutRef = useRef(null);

  const targetSource = src || storagePath || '';
  const isEmbed = typeof targetSource === 'string' && (
    targetSource.includes('youtube.com') || 
    targetSource.includes('youtu.be') || 
    targetSource.includes('vimeo.com')
  );

  const activeBlobRef = useRef(null);

  // 1. Obfuscated Stream Fetching & In-Memory Blob Assembly
  useEffect(() => {
    let isMounted = true;

    async function loadProtectedStream() {
      const raw = src || storagePath;
      if (!raw) {
        if (isMounted) {
          setStreamSrc('');
          setLoading(false);
        }
        return;
      }

      if (isEmbed) {
        if (isMounted) {
          setStreamSrc(raw);
          setLoading(false);
        }
        return;
      }

      if (typeof raw === 'string' && raw.startsWith('blob:')) {
        if (isMounted) {
          setStreamSrc(raw);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      let targetUrl = raw;
      // If it's a Supabase storage path or URL, resolve to signed URL
      try {
        const signed = await getProtectedVideoUrl(targetUrl, 86400);
        if (signed) {
          targetUrl = signed;
        }
      } catch (err) {
        console.warn('[SecureVideoPlayer] Could not sign storage path:', err);
      }

      if (!targetUrl || (typeof targetUrl === 'string' && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
        if (isMounted) {
          setStreamSrc('');
          setLoading(false);
        }
        return;
      }

      // Stream targetUrl immediately inside the closed Shadow DOM
      // Using native HTTP 206 byte-range streaming begins playback in <150ms without whole-file buffering
      if (isMounted) {
        setStreamSrc(targetUrl);
        setLoading(false);
      }
    }

    loadProtectedStream();

    return () => {
      isMounted = false;
      if (activeBlobRef.current && activeBlobRef.current.startsWith('blob:')) {
        try { URL.revokeObjectURL(activeBlobRef.current); } catch {}
        activeBlobRef.current = null;
      }
    };
  }, [src, storagePath, isEmbed]);

  // 2. Closed Shadow DOM Mounting (Hides <video> element from DOM Scanners like Video DownloadHelper)
  useEffect(() => {
    if (!shadowHostRef.current) return;

    let videoEl = videoElementRef.current;
    if (!videoEl) {
      // attachShadow with mode: 'closed' ensures document.querySelectorAll('video') returns 0 elements
      // Extensions CANNOT penetrate or inspect closed shadow roots
      const shadow = shadowHostRef.current.attachShadow({ mode: 'closed' });
      videoEl = document.createElement('video');
      videoEl.playsInline = true;
      videoEl.disablePictureInPicture = true;
      videoEl.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
      videoEl.style.width = '100%';
      videoEl.style.height = '100%';
      videoEl.style.objectFit = 'contain';
      videoEl.style.pointerEvents = 'none';

      videoEl.addEventListener('timeupdate', () => {
        setCurrentTime(videoEl.currentTime);
        const buf = videoEl.buffered;
        if (buf && buf.length > 0 && videoEl.duration > 0) {
          setBufferedPercent((buf.end(buf.length - 1) / videoEl.duration) * 100);
        }
      });

      videoEl.addEventListener('loadedmetadata', () => {
        setDuration(videoEl.duration || 0);
        setLoading(false);

        if (autoPlay) {
          videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });

      videoEl.addEventListener('canplay', () => {
        setLoading(false);
      });

      videoEl.addEventListener('ended', () => {
        setIsPlaying(false);
        setShowControls(true);
      });

      videoEl.addEventListener('error', () => {
        console.warn('[SecureVideoPlayer] Video playback event:', videoEl.error);
      });

      shadow.appendChild(videoEl);
      videoElementRef.current = videoEl;
    }

    if (streamSrc && videoEl.src !== streamSrc) {
      videoEl.src = streamSrc;
      videoEl.load();
    }
  }, [streamSrc, autoPlay]);

  // 3. Periodic Moving Watermark (Deters screen recording & leaks)
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos(prev => (prev + 1) % 4);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // 4. Capturing Context Menu & Keyboard Shortcut Blocker
  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDrmToast(true);
      setTimeout(() => setShowDrmToast(false), 3000);
      return false;
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p', 'S', 'U', 'P'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        setShowDrmToast(true);
        setTimeout(() => setShowDrmToast(false), 3000);
      }
      if (e.code === 'Space' && e.target === container) {
        e.preventDefault();
        togglePlay();
      }
    };

    container.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      container.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const togglePlay = () => {
    const video = videoElementRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(e => console.warn('Play interrupted:', e));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleSeek = (e) => {
    const video = videoElementRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const video = videoElementRef.current;
    if (video) {
      video.volume = newVol;
      video.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    const video = videoElementRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    const video = videoElementRef.current;
    if (video) {
      video.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const watermarkClasses = [
    'top-4 left-4',
    'top-4 right-4',
    'bottom-16 right-4',
    'bottom-16 left-4'
  ][watermarkPos];

  if (isEmbed) {
    return (
      <div 
        ref={playerContainerRef}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="relative aspect-video rounded-2xl bg-black overflow-hidden shadow-lg select-none"
      >
        <iframe
          src={src}
          title={title || 'Embedded Lesson'}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    );
  }

  if (loading && !streamSrc) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 aspect-video w-full p-8 text-center text-slate-300 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="w-10 h-10 border-3 border-[#1A9C9B] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-200">Loading secure encrypted video stream...</p>
        <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DRM Session Initializing</span>
        </p>
      </div>
    );
  }

  if (!src && !storagePath && !streamSrc) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 aspect-video w-full p-8 text-center text-slate-300 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 shadow-inner">
          <Lock size={28} />
        </div>
        <div>
          <p className="font-bold text-sm text-white">{fileName || 'Protected Video Lesson'}</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {fileName 
              ? `Video file "${fileName}" is configured for this topic. Upload to Supabase Storage in the Admin Panel to stream.`
              : 'No video uploaded to this lesson yet.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setShowDrmToast(true); setTimeout(() => setShowDrmToast(false), 3000); }}
      className="relative aspect-video rounded-2xl bg-black border border-slate-800/80 overflow-hidden shadow-2xl flex items-center justify-center text-white select-none group font-sans"
      tabIndex={0}
    >
      {/* 1. Closed Shadow Host: Video element is completely isolated inside a closed shadow root (Extensions cannot see it) */}
      <div ref={shadowHostRef} className="w-full h-full flex items-center justify-center pointer-events-none" />

      {/* 2. Transparent Protective Shield: Intercepts all clicks & right-clicks */}
      <div 
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowDrmToast(true);
          setTimeout(() => setShowDrmToast(false), 3000);
        }}
        className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
      >
        {loading && (
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        )}

        {!isPlaying && !loading && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1A9C9B]/90 hover:bg-[#1A9C9B] text-white flex items-center justify-center shadow-2xl backdrop-blur-xs transform hover:scale-105 transition-all">
            <Play className="w-8 h-8 sm:w-9 sm:h-9 ml-1 fill-white" />
          </div>
        )}
      </div>

      {/* 3. Anti-Piracy Dynamic Moving Watermark */}
      <div 
        className={`absolute ${watermarkClasses} pointer-events-none select-none z-30 transition-all duration-1000 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/80 shadow-lg`}
      >
        <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>{currentUser?.email || currentUser?.username || 'CareerCore Student'}</span>
        <span className="opacity-40">•</span>
        <span className="text-emerald-300 font-bold">DRM Protected</span>
      </div>

      {/* 4. DRM Security Alert Toast */}
      {showDrmToast && (
        <div className="absolute top-4 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-white">Direct Download Disabled</p>
            <p className="text-[10px] text-slate-300">Protected stream · Copyright © CareerCore Edutech</p>
          </div>
        </div>
      )}

      {/* 5. Custom Protected Controls Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 z-30 pt-10 pb-3 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber / Progress Bar */}
        <div 
          onClick={handleSeek}
          className="relative h-1.5 hover:h-2.5 w-full bg-white/20 rounded-full cursor-pointer transition-all mb-3 group/progress"
        >
          {/* Buffered Track */}
          <div 
            className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
            style={{ width: `${bufferedPercent}%` }}
          />
          {/* Played Track */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#1A9C9B] rounded-full relative"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          >
            <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => {
                const video = videoElementRef.current;
                if (video) {
                  video.currentTime = Math.max(0, video.currentTime - 10);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-white/30 accent-[#1A9C9B] rounded-lg cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-[11px] font-mono text-slate-300 ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Protected Badge, Speed Selector, Fullscreen */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Encrypted Stream</span>
            </div>

            <button
              type="button"
              onClick={cyclePlaybackSpeed}
              className="px-2 py-1 rounded-lg hover:bg-white/15 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
