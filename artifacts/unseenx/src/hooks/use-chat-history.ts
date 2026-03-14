import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "@workspace/api-client-react";

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const STORAGE_KEY = "unseenx-chat-sessions";

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed.sort((a, b) => b.updatedAt - a.updatedAt));
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load chat history from localStorage", err);
    }
  }, []);

  // Save to local storage whenever sessions change
  useEffect(() => {
    try {
      if (sessions.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save chat history to localStorage", err);
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, []);

  const addMessageToSession = useCallback(
    (sessionId: string, message: ChatMessage) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          
          const newMessages = [...session.messages, message];
          // Generate title from first user message if it's currently default
          let title = session.title;
          if (title === "New Conversation" && message.role === "user") {
            title = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
          }
          
          return {
            ...session,
            messages: newMessages,
            title,
            updatedAt: Date.now(),
          };
        }).sort((a, b) => b.updatedAt - a.updatedAt) // Keep most recent at top
      );
    },
    []
  );

  const updateMessageInSession = useCallback(
    (sessionId: string, messageIndex: number, newContent: string) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          const updatedMessages = [...session.messages];
          updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent };
          return { ...session, messages: updatedMessages, updatedAt: Date.now() };
        })
      );
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  }, [activeSessionId]);

  return {
    sessions,
    activeSessionId,
    activeSession,
    setActiveSessionId,
    createNewSession,
    addMessageToSession,
    updateMessageInSession,
    deleteSession,
  };
}
