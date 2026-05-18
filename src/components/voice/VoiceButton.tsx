'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VoiceState } from '@/types/voice'

interface VoiceButtonProps {
  state: VoiceState
  onPressStart: () => void
  onPressEnd: () => void
  disabled?: boolean
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Toca para hablar',
  'requesting-permission': 'Solicitando permiso...',
  listening: 'Escuchando...',
  transcribing: 'Transcribiendo...',
  retrieving: 'Consultando CNB...',
  reasoning: 'Pensando...',
  speaking: 'Hablando...',
  paused: 'Pausado',
  error: 'Error',
}

const STATE_COLORS: Record<VoiceState, string> = {
  idle: 'bg-brand-500 hover:bg-brand-600',
  'requesting-permission': 'bg-yellow-400',
  listening: 'bg-red-500',
  transcribing: 'bg-gray-400',
  retrieving: 'bg-gray-400',
  reasoning: 'bg-gray-400',
  speaking: 'bg-green-500',
  paused: 'bg-orange-400',
  error: 'bg-red-600',
}

const SPINNER_STATES: Set<VoiceState> = new Set([
  'transcribing',
  'retrieving',
  'reasoning',
])

const WAVE_STATES: Set<VoiceState> = new Set(['speaking'])

function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
      <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.08A7 7 0 0 0 19 10z" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        d="M12 2a10 10 0 0 1 10 10"
        opacity={0.25}
      />
      <path
        strokeLinecap="round"
        d="M12 2a10 10 0 0 1 10 10"
        strokeDasharray="15.7 47.1"
        strokeDashoffset="0"
      />
    </svg>
  )
}

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12h2M6 7v10M10 4v16M14 7v10M18 4v16M22 12h0" />
    </svg>
  )
}

const pulseVariants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  idle: { scale: 1, opacity: 1 },
}

const waveVariants = {
  animate: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  idle: { scale: 1 },
}

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  idle: { rotate: 0 },
}

export function VoiceButton({
  state,
  onPressStart,
  onPressEnd,
  disabled = false,
}: VoiceButtonProps) {
  const isListening = state === 'listening'
  const isSpinner = SPINNER_STATES.has(state)
  const isWave = WAVE_STATES.has(state)
  const isDisabled = disabled || isSpinner

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!isDisabled) {
        onPressStart()
      }
    },
    [isDisabled, onPressStart],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!isDisabled) {
        onPressEnd()
      }
    },
    [isDisabled, onPressEnd],
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (state === 'listening') {
        onPressEnd()
      }
    },
    [state, onPressEnd],
  )

  const colorClass = STATE_COLORS[state]
  const label = STATE_LABELS[state]

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Outer touch target: 88px to comfortably exceed 44px minimum */}
      <div className="relative flex items-center justify-center w-[88px] h-[88px]">
        {/* Pulse ring for listening state */}
        <AnimatePresence>
          {isListening && (
            <motion.span
              key="pulse-ring"
              className="absolute inset-0 rounded-full bg-red-400 opacity-30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.35, opacity: 0 }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          aria-label={label}
          aria-pressed={isListening}
          disabled={isDisabled}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className={[
            'relative flex items-center justify-center',
            'w-[80px] h-[80px] rounded-full',
            'text-white shadow-lg',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300',
            'touch-none',
            colorClass,
            isDisabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:scale-95',
          ].join(' ')}
          variants={
            isListening
              ? pulseVariants
              : isWave
              ? waveVariants
              : { animate: {}, idle: {} }
          }
          animate={isListening || isWave ? 'animate' : 'idle'}
          whileTap={isDisabled ? {} : { scale: 0.93 }}
        >
          <AnimatePresence mode="wait">
            {isSpinner ? (
              <motion.span
                key="spinner"
                variants={spinnerVariants}
                animate="animate"
                initial={{ rotate: 0 }}
                className="flex items-center justify-center"
              >
                <SpinnerIcon className="w-8 h-8" />
              </motion.span>
            ) : isWave ? (
              <motion.span
                key="wave"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <WaveIcon className="w-8 h-8" />
              </motion.span>
            ) : (
              <motion.span
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <MicrophoneIcon className="w-8 h-8" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={[
            'text-sm font-medium text-center leading-tight',
            state === 'error' ? 'text-red-600' : 'text-gray-600',
          ].join(' ')}
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
