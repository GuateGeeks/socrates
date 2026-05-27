'use client'

import type { PointerEvent } from 'react'

import { SessionStatus } from '@/types/realtime'

interface BottomToolbarProps {
  sessionStatus: SessionStatus
  onToggleConnection: () => void
  isPTTActive: boolean
  setIsPTTActive: (val: boolean) => void
  isPTTUserSpeaking: boolean
  handleTalkButtonDown: () => void
  handleTalkButtonUp: () => void
  isEventsPaneExpanded: boolean
  setIsEventsPaneExpanded: (val: boolean) => void
  isAudioPlaybackEnabled: boolean
  setIsAudioPlaybackEnabled: (val: boolean) => void
  codec: string
  onCodecChange: (codec: string) => void
}

function ConnectionButton({
  sessionStatus,
  onToggleConnection,
}: {
  sessionStatus: SessionStatus
  onToggleConnection: () => void
}) {
  const isConnecting = sessionStatus === 'CONNECTING'
  const isConnected = sessionStatus === 'CONNECTED'

  let label: string
  let colorClass: string

  if (isConnecting) {
    label = 'Conectando...'
    colorClass = 'bg-gray-300 text-gray-500 cursor-not-allowed'
  } else if (isConnected) {
    label = 'Desconectar'
    colorClass = 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white'
  } else {
    label = 'Conectar'
    colorClass = 'bg-gray-900 hover:bg-gray-700 active:bg-gray-800 text-white'
  }

  return (
    <button
      type="button"
      onClick={isConnecting ? undefined : onToggleConnection}
      disabled={isConnecting}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${colorClass}`}
      aria-label={label}
    >
      {label}
    </button>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  id: string
  label: string
}) {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-1.5 cursor-pointer select-none"
    >
      <span className="text-xs text-gray-500">{label}</span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-8 h-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${
          checked ? 'bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
      </button>
    </label>
  )
}

export function BottomToolbar({
  sessionStatus,
  onToggleConnection,
  isPTTActive,
  setIsPTTActive,
  isPTTUserSpeaking,
  handleTalkButtonDown,
  handleTalkButtonUp,
  isEventsPaneExpanded,
  setIsEventsPaneExpanded,
  isAudioPlaybackEnabled,
  setIsAudioPlaybackEnabled,
  codec,
  onCodecChange,
}: BottomToolbarProps) {
  const isConnected = sessionStatus === 'CONNECTED'

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!isConnected) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    handleTalkButtonDown()
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!isConnected) return
    event.preventDefault()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    handleTalkButtonUp()
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (!isConnected) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    handleTalkButtonUp()
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white">
      {/* Left group: connection + PTT toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <ConnectionButton
          sessionStatus={sessionStatus}
          onToggleConnection={onToggleConnection}
        />

        <ToggleSwitch
          id="ptt-toggle"
          checked={isPTTActive}
          onChange={setIsPTTActive}
          label="Pulsar para hablar"
        />

        {isPTTActive && (
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            disabled={!isConnected}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors select-none touch-none ${
              isPTTUserSpeaking
                ? 'bg-gray-300 border-gray-400 text-gray-800'
                : isConnected
                ? 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Mantener presionado para hablar"
            aria-pressed={isPTTUserSpeaking}
          >
            {isPTTUserSpeaking ? '🎙 Hablando...' : 'Hablar'}
          </button>
        )}
      </div>

      {/* Right group: audio, logs, codec */}
      <div className="flex items-center gap-3 flex-wrap">
        <ToggleSwitch
          id="audio-toggle"
          checked={isAudioPlaybackEnabled}
          onChange={setIsAudioPlaybackEnabled}
          label="Audio"
        />

        <ToggleSwitch
          id="logs-toggle"
          checked={isEventsPaneExpanded}
          onChange={setIsEventsPaneExpanded}
          label="Registros"
        />

        <div className="flex items-center gap-1.5">
          <label htmlFor="codec-select" className="text-xs text-gray-500 whitespace-nowrap">
            Codec
          </label>
          <select
            id="codec-select"
            value={codec}
            onChange={(e) => onCodecChange(e.target.value)}
            className="text-xs rounded border border-gray-200 bg-white text-gray-700 px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
          >
            <option value="opus">opus</option>
            <option value="pcm16">pcm16</option>
            <option value="g711_ulaw">g711_ulaw</option>
            <option value="g711_alaw">g711_alaw</option>
          </select>
        </div>
      </div>
    </div>
  )
}
