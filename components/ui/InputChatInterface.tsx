"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send } from "lucide-react";

const joinClasses = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface InputChatInterfaceProps {
  onSend: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (text: string) => void;
  onSendHover: (isHovered: boolean) => void;
  onClick: () => void;
  disabled: boolean;
}

const InputChatInterface: React.FC<InputChatInterfaceProps> = ({
  onSend, 
  onFocus, 
  onBlur, 
  onChange,
  onSendHover,
  onClick,
  disabled
}) => {
  const [inputText, setInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxChars = 256;

  useEffect(() => {
    setCharCount(inputText.length);
    onChange?.(inputText);
  }, [inputText, onChange]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleSend = () => {
    if (inputText.trim() && charCount <= maxChars && !disabled) {
      onSend?.(inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
      setIsFocused(true);
      onClick?.();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 relative">
        <div
          onClick={handleContainerClick}
          className={joinClasses(
            "h-12 rounded-full text-sm px-6 py-3 flex-1",
            "flex items-center justify-between",
            "transition-all duration-300 bg-[#2e2e2e]",
            isFocused ? "ring-1 ring-[rgba(255,255,255,0.3)] shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "ring-1 ring-[#4a4a4a]",
            charCount > maxChars && "ring-2 ring-red-500",
            disabled ? "cursor-not-allowed opacity-75" : "cursor-text"
          )}
        >
          <div className="flex-1 overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={disabled ? "Generating response..." : "Type your message..."}
              className={joinClasses(
                "w-full bg-transparent text-white/90 outline-none placeholder:text-gray-400",
                disabled && "cursor-not-allowed"
              )}
              maxLength={maxChars + 1}
              disabled={disabled}
              aria-label="Message input"
            />
          </div>
          <div className={joinClasses(
            "ml-2 text-xs transition-colors duration-200",
            charCount > maxChars ? "text-red-400" :
            charCount > maxChars * 0.8 ? "text-orange-400" :
            charCount > maxChars * 0.6 ? "text-yellow-400" :
            "text-gray-400"
          )}>
            {charCount}/{maxChars}
          </div>
        </div>

        <button
          onClick={handleSend}
          onMouseEnter={() => {
            onSendHover?.(true);
          }}
          onMouseLeave={() => {
            onSendHover?.(false);
          }}
          disabled={!inputText.trim() || charCount > maxChars || disabled}
          className={`btn ${inputText.trim() && charCount <= maxChars && !disabled ? 'active' : ''} ${disabled ? 'opacity-50' : ''}`}
          aria-label="Send message"
        >
          <div className="send-icon-wrapper flex items-center justify-center">
            <Send className={`w-5 h-5 transition-all duration-200 ${disabled ? 'opacity-50' : ''}`} />
          </div>
        </button>
      </div>

      <style jsx>{`
        .btn {
          width: 44px;
          height: 44px;
          border-radius: 0.875em;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: transparent;
          color: white;
          border: none;
          outline: none;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 1;
          isolation: isolate;
          box-shadow: inset 0 0px 0px 0.5px rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.03) 0px 0.25em 0.3em -1px,
            rgba(0, 0, 0, 0.02) 0px 0.15em 0.25em -1px;
        }

        .send-icon-wrapper {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-center: center;
          width: 100%;
          height: 100%;
        }

        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.875em;
          background-image: conic-gradient(
            from var(--mask) at 50% 50%,
            #22ffff 0%,
            #3c64ff 11%,
            #c03afc 22%,
            #ff54e8 33%,
            #ff5959 44%,
            #ff9a07 55%,
            #feff07 66%,
            #58ff07 77%,
            #07ff77 88%,
            #22ffff 100%
          );
          filter: blur(1em);
          z-index: -2;
          opacity: 0.4;
          scale: 0.85;
          transition: all 0.3s ease;
        }

        .btn::after {
          z-index: -1;
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 0px 0px rgba(255, 255, 255, 0.3);
          border-radius: 0.875em;
          transition: all 0.3s ease;
        }

        .btn.active {
          animation: shine 6s ease-in-out infinite;
          transform: translateZ(0);
          box-shadow: 0 0 30px rgba(34, 255, 255, 0.5),
                     0 0 20px rgba(60, 100, 255, 0.3),
                     0 0 10px rgba(192, 58, 252, 0.2);
        }

        .btn.active::before {
          opacity: 1;
          scale: 1;
          filter: blur(1.5em);
          animation: rotate 4s linear infinite;
        }

        .btn.active::after {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(40px);
          box-shadow: inset 0 1px 0px 0px rgba(255, 255, 255, 0.8),
                     inset 0 -1px 0px 0px rgba(255, 255, 255, 0.6),
                     0 0 20px rgba(255, 255, 255, 0.3);
        }

        .btn:disabled {
          cursor: not-allowed;
        }

        .btn:not(:disabled):active {
          scale: 0.95;
        }

        @keyframes shine {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes rotate {
          from { --mask: 0deg; }
          to { --mask: 360deg; }
        }

        @property --mask {
          syntax: '<angle>';
          inherits: false;
          initial-value: 30deg;
        }
      `}</style>
    </div>
  );
};

export default InputChatInterface;