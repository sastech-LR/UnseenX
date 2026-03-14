import { Plus, MessageSquare, Trash2, X, Menu } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatSession } from "@/hooks/use-chat-history";
import { useState, useEffect } from "react";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  // Close sidebar on mobile when a session is selected
  const handleSelect = (id: string) => {
    onSelectSession(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}images/unseenx-logo.png`} 
                alt="UnseenX Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-sidebar-foreground leading-none">UnseenX</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">By SAS Tech Inc</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-md hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center p-4 text-sm text-sidebar-foreground/50 mt-4">
              No previous conversations
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                  activeSessionId === session.id
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground"
                )}
                onClick={() => handleSelect(session.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className={cn(
                    "w-4 h-4 shrink-0", 
                    activeSessionId === session.id ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                  )} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {session.title}
                    </span>
                    <span className="text-[10px] opacity-60">
                      {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-sidebar-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shrink-0"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border/50 text-xs text-sidebar-foreground/40 flex items-center justify-center">
          <span className="truncate">SAS Tech Inc • Liberia</span>
        </div>
      </motion.aside>
    </>
  );
}
