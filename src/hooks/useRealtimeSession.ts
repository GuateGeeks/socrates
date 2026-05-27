"use client";

import { useCallback, useRef, useState } from "react";
import {
  RealtimeSession,
  RealtimeAgent,
  OpenAIRealtimeWebRTC,
} from "@openai/agents/realtime";

import { applyCodecPreferences } from "@/lib/realtime/codecUtils";
import { useEvent } from "@/contexts/EventContext";
import { useHandleSessionHistory } from "@/hooks/useHandleSessionHistory";
import { REALTIME_MODEL, REALTIME_TRANSCRIPTION_MODEL } from "@/lib/realtime/clientSecret";
import { SessionStatus } from "@/types/realtime";

export interface RealtimeSessionCallbacks {
  onConnectionChange?: (status: SessionStatus) => void;
  onAgentHandoff?: (agentName: string) => void;
}

export interface ConnectOptions {
  getEphemeralKey: () => Promise<string>;
  initialAgents: RealtimeAgent[];
  audioElement?: HTMLAudioElement;
  mediaStream?: MediaStream;
  extraContext?: Record<string, any>;
  outputGuardrails?: any[];
}

export function useRealtimeSession(callbacks: RealtimeSessionCallbacks = {}) {
  const sessionRef = useRef<RealtimeSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("DISCONNECTED");
  const { logClientEvent, logServerEvent } = useEvent();

  const updateStatus = useCallback(
    (s: SessionStatus) => {
      setStatus(s);
      callbacks.onConnectionChange?.(s);
      logClientEvent({}, s);
    },
    [callbacks, logClientEvent],
  );

  const historyHandlers = useHandleSessionHistory().current;

  const codecParamRef = useRef<string>(
    (typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("codec") ?? "opus")
      : "opus"
    ).toLowerCase(),
  );

  const applyCodec = useCallback(
    (pc: RTCPeerConnection) => applyCodecPreferences(pc, codecParamRef.current),
    [],
  );

  const handleAgentHandoff = useCallback((item: any) => {
    const history = item?.context?.history;
    if (!Array.isArray(history) || history.length === 0) return;

    const lastMessage = history[history.length - 1];
    const name = typeof lastMessage?.name === "string" ? lastMessage.name : "";
    const agentName = name.split("transfer_to_")[1];
    if (!agentName) return;

    callbacks.onAgentHandoff?.(agentName);
  }, [callbacks]);

  const handleTransportEvent = useCallback((event: any) => {
    // Handle additional server events that aren't managed by the session
    switch (event.type) {
      case "conversation.item.input_audio_transcription.completed": {
        historyHandlers.handleTranscriptionCompleted(event);
        break;
      }
      case "response.output_audio_transcript.done": {
        historyHandlers.handleTranscriptionCompleted(event);
        break;
      }
      case "response.output_audio_transcript.delta": {
        historyHandlers.handleTranscriptionDelta(event);
        break;
      }
      default: {
        logServerEvent(event);
        break;
      }
    }
  }, [historyHandlers, logServerEvent]);

  const attachSessionListeners = useCallback((session: RealtimeSession) => {
    session.on("error", (...args: any[]) => {
      logServerEvent({
        type: "error",
        message: args[0],
      });
    });

    session.on("agent_handoff", handleAgentHandoff);
    session.on("agent_tool_start", historyHandlers.handleAgentToolStart);
    session.on("agent_tool_end", historyHandlers.handleAgentToolEnd);
    session.on("history_updated", historyHandlers.handleHistoryUpdated);
    session.on("history_added", historyHandlers.handleHistoryAdded);
    session.on("guardrail_tripped", historyHandlers.handleGuardrailTripped);
    session.on("transport_event", handleTransportEvent);
  }, [handleAgentHandoff, handleTransportEvent, historyHandlers, logServerEvent]);


  const connect = useCallback(
    async ({
      getEphemeralKey,
      initialAgents,
      audioElement,
      mediaStream,
      extraContext,
      outputGuardrails,
    }: ConnectOptions) => {
      if (sessionRef.current) return; // already connected

      updateStatus("CONNECTING");

      const ek = await getEphemeralKey();
      const rootAgent = initialAgents[0];

      const realtimeSession = new RealtimeSession(rootAgent, {
        transport: new OpenAIRealtimeWebRTC({
          audioElement,
          mediaStream,
          // Set preferred codec before offer creation
          changePeerConnection: async (pc: RTCPeerConnection) => {
            applyCodec(pc);
            return pc;
          },
        }),
        model: REALTIME_MODEL,
        config: {
          inputAudioTranscription: {
            model: REALTIME_TRANSCRIPTION_MODEL,
          },
        },
        outputGuardrails: outputGuardrails ?? [],
        context: extraContext ?? {},
      });

      attachSessionListeners(realtimeSession);
      sessionRef.current = realtimeSession;

      await realtimeSession.connect({ apiKey: ek });
      updateStatus("CONNECTED");
    },
    [applyCodec, attachSessionListeners, updateStatus],
  );

  const disconnect = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    updateStatus("DISCONNECTED");
  }, [updateStatus]);

  const assertConnected = () => {
    if (!sessionRef.current) throw new Error("RealtimeSession not connected");
  };

  const interrupt = useCallback(() => {
    sessionRef.current?.interrupt();
  }, []);

  const sendUserText = useCallback((text: string) => {
    assertConnected();
    sessionRef.current!.sendMessage(text);
  }, []);

  const sendEvent = useCallback((ev: any) => {
    sessionRef.current?.transport.sendEvent(ev);
  }, []);

  const mute = useCallback((m: boolean) => {
    sessionRef.current?.mute(m);
  }, []);

  return {
    status,
    connect,
    disconnect,
    sendUserText,
    sendEvent,
    mute,
    interrupt,
  } as const;
}
