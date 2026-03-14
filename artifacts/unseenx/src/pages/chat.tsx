import { useState, useRef, useEffect } from "react";
import { Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSendMessage, type ChatMessage } from "@workspace/api-client-react";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Sidebar } from "@/components/chat/sidebar";
import { MessageBubble, LoadingBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    sessions,
    activeSessionId,
    activeSession,
    setActiveSessionId,
    createNewSession,
    addMessageToSession,
    deleteSession
  } = useChatHistory();

  const { mutate: sendMessage, isPending } = useSendMessage();

  // Initialize a new session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !activeSessionId) {
      createNewSession();
    }
  }, [sessions.length, activeSessionId, createNewSession]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isPending]);

  const handleSendMessage = (content: string) => {
    if (!activeSessionId || !content.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: content.trim() };
    addMessageToSession(activeSessionId, userMessage);

    // Prepare full context for API
    const currentMessages = activeSession?.messages || [];
    const messagesContext = [...currentMessages, userMessage];

    sendMessage(
      { data: { messages: messagesContext } },
      {
        onSuccess: (data) => {
          if (data.message) {
            addMessageToSession(activeSessionId, data.message as ChatMessage);
          }
        },
        onError: (err) => {
          // Add a generic error message from assistant if mutation fails
          const errorMsg: ChatMessage = {
            role: "assistant",
            content: `*Error:* Failed to connect to UnseenX servers. Please try again later. \n\n\`${err.message || "Network Error"}\``
          };
          addMessageToSession(activeSessionId, errorMsg);
        }
      }
    );
  };

  const messages = activeSession?.messages || [];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full relative w-full md:w-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold tracking-tight">UnseenX</div>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12 w-full flex justify-center scrollbar-hide">
          <div className="w-full max-w-4xl flex flex-col gap-6 pb-24">
            
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 flex flex-col items-center justify-center text-center mt-20 md:mt-32"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-8 relative shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)]">
                  <Sparkles className="w-10 h-10 text-primary absolute opacity-40 z-0 animate-pulse" />
                  <img 
                    src={`${import.meta.env.BASE_URL}images/unseenx-logo.png`} 
                    alt="UnseenX Logo" 
                    className="w-full h-full object-cover z-10 p-2"
                  />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Welcome to UnseenX
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl text-balance leading-relaxed">
                  I'm your advanced AI assistant developed by <strong className="text-foreground font-semibold">SAS Tech Inc</strong> in Liberia. Specializing in Earth observation, satellite tech, and global knowledge. How can I help you today?
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                  {/* Suggestion Cards */}
                  {[
                    "What's the latest in satellite technology?",
                    "Tell me about Earth observation in West Africa",
                    "How can AI assist with agriculture in Liberia?",
                    "Explain orbital mechanics simply"
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary text-left text-sm text-foreground/80 hover:text-foreground transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages List */}
            {messages.map((msg, index) => (
              <MessageBubble 
                key={`${activeSessionId}-${index}`} 
                message={msg} 
                isLatest={index === messages.length - 1} 
              />
            ))}
            
            {/* Loading Indicator */}
            {isPending && <LoadingBubble />}
            
            {/* Invisible div for scrolling */}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
          <div className="w-full max-w-4xl mx-auto pointer-events-auto">
            <ChatInput onSend={handleSendMessage} disabled={isPending} />
            <p className="text-center text-[11px] text-muted-foreground mt-3 font-medium tracking-wide opacity-70">
              UnseenX by SAS Tech Inc • AI can make mistakes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
