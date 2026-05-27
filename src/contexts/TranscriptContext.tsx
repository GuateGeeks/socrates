"use client";
import React, { createContext, useContext, useState, FC, PropsWithChildren } from "react";
import { v4 as uuidv4 } from "uuid";
import { TranscriptItem } from "@/types/realtime";

type TranscriptContextValue = {
  transcriptItems: TranscriptItem[];
  addTranscriptMessage: (itemId: string, role: "user" | "assistant", text: string, isHidden?: boolean) => void;
  updateTranscriptMessage: (itemId: string, text: string, isDelta: boolean) => void;
  addTranscriptBreadcrumb: (title: string, data?: Record<string, any>) => void;
  toggleTranscriptItemExpand: (itemId: string) => void;
  updateTranscriptItem: (itemId: string, updatedProperties: Partial<TranscriptItem>) => void;
};

const TranscriptContext = createContext<TranscriptContextValue | undefined>(undefined);

function getTimestamp(): string {
  const now = new Date();
  const hms = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const ms = now.getMilliseconds().toString().padStart(3, "0");
  return `${hms}.${ms}`;
}

export const TranscriptProvider: FC<PropsWithChildren> = ({ children }) => {
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);

  const addTranscriptMessage = (
    itemId: string,
    role: "user" | "assistant",
    text: string,
    isHidden: boolean = false
  ) => {
    setTranscriptItems((prev) => {
      const exists = prev.some((item) => item.itemId === itemId);
      if (exists) return prev;

      const newItem: TranscriptItem = {
        itemId,
        type: "MESSAGE",
        role,
        title: text,
        expanded: false,
        timestamp: getTimestamp(),
        createdAtMs: Date.now(),
        status: "IN_PROGRESS",
        isHidden,
      };
      return [...prev, newItem];
    });
  };

  const updateTranscriptMessage = (itemId: string, text: string, isDelta: boolean) => {
    setTranscriptItems((prev) =>
      prev.map((item) => {
        if (item.itemId !== itemId) return item;
        return {
          ...item,
          title: isDelta ? (item.title ?? "") + text : text,
        };
      })
    );
  };

  const addTranscriptBreadcrumb = (title: string, data?: Record<string, any>) => {
    const newItem: TranscriptItem = {
      itemId: uuidv4(),
      type: "BREADCRUMB",
      title,
      data,
      expanded: false,
      timestamp: getTimestamp(),
      createdAtMs: Date.now(),
      status: "DONE",
      isHidden: false,
    };
    setTranscriptItems((prev) => [...prev, newItem]);
  };

  const toggleTranscriptItemExpand = (itemId: string) => {
    setTranscriptItems((prev) =>
      prev.map((item) => {
        if (item.itemId !== itemId) return item;
        return { ...item, expanded: !item.expanded };
      })
    );
  };

  const updateTranscriptItem = (itemId: string, updatedProperties: Partial<TranscriptItem>) => {
    setTranscriptItems((prev) =>
      prev.map((item) => {
        if (item.itemId !== itemId) return item;
        return { ...item, ...updatedProperties };
      })
    );
  };

  return (
    <TranscriptContext.Provider
      value={{
        transcriptItems,
        addTranscriptMessage,
        updateTranscriptMessage,
        addTranscriptBreadcrumb,
        toggleTranscriptItemExpand,
        updateTranscriptItem,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

export function useTranscript(): TranscriptContextValue {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error("useTranscript must be used within a TranscriptProvider");
  }
  return context;
}
