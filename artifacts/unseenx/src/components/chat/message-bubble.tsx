import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@workspace/api-client-react";
import { User, Sparkles } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 15, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full px-4 md:px-0",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[75%] gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-secondary-foreground/70">
              <User className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden relative shadow-sm shadow-primary/20">
              <Sparkles className="w-4 h-4 text-primary absolute opacity-30 z-0 animate-pulse" />
              <img 
                src={`${import.meta.env.BASE_URL}images/unseenx-logo.png`} 
                alt="UnseenX" 
                className="w-full h-full object-cover z-10"
              />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "rounded-2xl px-5 py-4 shadow-sm",
            isUser 
              ? "bg-primary text-primary-foreground rounded-tr-sm" 
              : "bg-card border border-card-border rounded-tl-sm"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm md:prose-base max-w-none prose-invert prose-p:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function LoadingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full justify-start px-4 md:px-0"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden relative shadow-sm shadow-primary/20">
            <img 
              src={`${import.meta.env.BASE_URL}images/unseenx-logo.png`} 
              alt="UnseenX" 
              className="w-full h-full object-cover z-10 opacity-70"
            />
          </div>
        </div>
        <div className="bg-card border border-card-border rounded-2xl rounded-tl-sm px-5 py-5 shadow-sm flex items-center gap-1.5 h-[52px]">
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
