'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'

interface AudioPlayerProps {
  audioUrl?: string
  onStateChange?: (playing: boolean) => void
}

type PlaybackSpeed = 0.75 | 1 | 1.25

const SPEEDS: PlaybackSpeed[] = [0.75, 1, 1.25]
const SPEED_LABELS: Record<PlaybackSpeed, string> = {
  0.75: '0.75x',
  1: '1x',
  1.25: '1.25x',
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6h12v12H6z" />
    </svg>
  )
}

export function AudioPlayer({ audioUrl, onStateChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const [hasAudio, setHasAudio] = useState(false)

  const notifyStateChange = useCallback(
    (playing: boolean) => {
      setIsPlaying(playing)
      onStateChange?.(playing)
    },
    [onStateChange],
  )

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      notifyStateChange(false)
      setProgress(0)
    }

    const handlePause = () => {
      notifyStateChange(false)
    }

    const handlePlay = () => {
      notifyStateChange(true)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
      audio.pause()
      audio.src = ''
    }
  }, [notifyStateChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!audioUrl) {
      audio.pause()
      audio.src = ''
      setHasAudio(false)
      setIsPlaying(false)
      setProgress(0)
      setDuration(0)
      return
    }

    audio.src = audioUrl
    setHasAudio(true)
    setProgress(0)

    audio.play().catch(() => {
      notifyStateChange(false)
    })
  }, [audioUrl, notifyStateChange])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = speed
    }
  }, [speed])

  const handlePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return
    audio.play().catch(() => {
      notifyStateChange(false)
    })
  }, [hasAudio, notifyStateChange])

  const handlePause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
  }, [])

  const handleStop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setProgress(0)
    notifyStateChange(false)
  }, [notifyStateChange])

  const handleSpeedChange = useCallback((nextSpeed: PlaybackSpeed) => {
    setSpeed(nextSpeed)
  }, [])

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds <= 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const currentTime = duration > 0 ? (progress / 100) * duration : 0

  return (
    <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-3">
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Progreso de reproducción"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-500 font-mono px-0.5">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Play / Pause */}
        {isPlaying ? (
          <button
            type="button"
            aria-label="Pausar"
            onClick={handlePause}
            disabled={!hasAudio}
            className={[
              'flex items-center justify-center',
              'w-11 h-11 rounded-full',
              'bg-brand-500 text-white shadow',
              'hover:bg-brand-600 active:scale-95 transition',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
            ].join(' ')}
          >
            <PauseIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Reproducir"
            onClick={handlePlay}
            disabled={!hasAudio}
            className={[
              'flex items-center justify-center',
              'w-11 h-11 rounded-full',
              'bg-brand-500 text-white shadow',
              'hover:bg-brand-600 active:scale-95 transition',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
            ].join(' ')}
          >
            <PlayIcon className="w-5 h-5" />
          </button>
        )}

        {/* Stop */}
        <button
          type="button"
          aria-label="Detener"
          onClick={handleStop}
          disabled={!hasAudio}
          className={[
            'flex items-center justify-center',
            'w-11 h-11 rounded-full',
            'bg-gray-200 text-gray-600',
            'hover:bg-gray-300 active:scale-95 transition',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
          ].join(' ')}
        >
          <StopIcon className="w-5 h-5" />
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1 ml-auto">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`Velocidad ${SPEED_LABELS[s]}`}
              aria-pressed={speed === s}
              onClick={() => handleSpeedChange(s)}
              className={[
                'min-w-[44px] h-11 px-2 rounded-lg text-xs font-semibold transition',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
                speed === s
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
              ].join(' ')}
            >
              {SPEED_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Status label */}
      <p className="text-center text-xs text-gray-400">
        {!hasAudio
          ? 'Sin audio'
          : isPlaying
          ? 'Reproduciendo'
          : progress > 0
          ? 'Pausado'
          : 'Listo'}
      </p>
    </div>
  )
}
