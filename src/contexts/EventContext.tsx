"use client";
import React, { createContext, useContext, useState, FC, PropsWithChildren } from "react";
import { v4 as uuidv4 } from "uuid";
import { LoggedEvent } from "@/types/realtime";

type EventContextValue = {
  loggedEvents: LoggedEvent[];
  logClientEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logServerEvent: (eventObj: Record<string, any>, eventNameSuffix?: string) => void;
  logHistoryItem: (item: any) => void;
  toggleExpand: (id: string) => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

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

export const EventProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);

  const addLoggedEvent = (
    direction: "client" | "server",
    eventObj: Record<string, any>,
    eventNameSuffix?: string
  ) => {
    const id = eventObj.event_id ?? uuidv4();
    const eventName = `${eventObj.type || ""} ${eventNameSuffix || ""}`.trim();

    const newEvent: LoggedEvent = {
      id,
      direction,
      expanded: false,
      timestamp: getTimestamp(),
      eventName,
      eventData: eventObj,
    };

    setLoggedEvents((prev) => [...prev, newEvent]);
  };

  const logClientEvent = (eventObj: Record<string, any>, eventNameSuffix?: string) => {
    addLoggedEvent("client", eventObj, eventNameSuffix);
  };

  const logServerEvent = (eventObj: Record<string, any>, eventNameSuffix?: string) => {
    addLoggedEvent("server", eventObj, eventNameSuffix);
  };

  const logHistoryItem = (item: any) => {
    let eventName: string;

    if (item.type === "message") {
      const role: string = item.role ?? "";
      const status: string = item.status ?? "";
      eventName = `${role}.${status}`;
    } else if (item.type === "function_call") {
      const name: string = item.name ?? "";
      const status: string = item.status ?? "";
      eventName = `function.${name}.${status}`;
    } else {
      eventName = item.type ?? "unknown";
    }

    const id = item.id ?? uuidv4();

    const newEvent: LoggedEvent = {
      id,
      direction: "server",
      expanded: false,
      timestamp: getTimestamp(),
      eventName,
      eventData: item,
    };

    setLoggedEvents((prev) => [...prev, newEvent]);
  };

  const toggleExpand = (id: string) => {
    setLoggedEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event;
        return { ...event, expanded: !event.expanded };
      })
    );
  };

  return (
    <EventContext.Provider
      value={{
        loggedEvents,
        logClientEvent,
        logServerEvent,
        logHistoryItem,
        toggleExpand,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEvent(): EventContextValue {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}
