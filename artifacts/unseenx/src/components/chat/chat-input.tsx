import { useState, useRef, useEffect } from "react";
import { Send, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 52), 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-end w-full max-w-4xl mx-auto bg-input/50 backdrop-blur-xl border border-border/80 rounded-2xl p-2 shadow-lg shadow-black/10 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message UnseenX..."
        disabled={disabled}
        className="w-full max-h-[200px] min-h-[52px] bg-transparent text-foreground placeholder:text-muted-foreground resize-none border-none outline-none py-3 px-4 text-[15px] leading-relaxed disabled:opacity-50 font-sans scrollbar-hide"
        rows={1}
      />
      
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          "absolute right-3 bottom-3 p-2 rounded-xl flex items-center justify-center transition-all duration-200",
          value.trim() && !disabled
            ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        )}
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
