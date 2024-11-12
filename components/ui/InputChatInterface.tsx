"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send } from "lucide-react";

const joinClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const InputChatInterface = ({ 
  onSend, 
  onFocus, 
  onBlur, 
  onChange,
  onSendHover,
  onClick 
}) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [displayText, setDisplayText] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const typingTimerRef = useRef(null);
  const inputRef = useRef(null);
  const maxChars = 75;

  useEffect(() => {
    setCharCount(inputText.length);
    setDisplayText(inputText.split(''));

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    if (inputText) {
      setIsTyping(true);
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    onChange?.(inputText);

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
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
    if (inputText.trim() && charCount <= maxChars) {
      onSend?.(inputText);
      setInputText("");
      setIsTyping(false);
      setDisplayText([]);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
    onClick?.();
  };

  return (
    <div className="relative">
      {/* Typing indicator */}
      <div className={joinClasses(
        "absolute -top-6 left-4 text-xs text-gray-400 transition-opacity duration-200",
        isTyping ? "opacity-100" : "opacity-0"
      )}>
        <span className="inline-flex items-center gap-2">
          Typing
          <span className="inline-flex items-center px-2 py-1 bg-[#4a4a4a] rounded-full">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 bg-gray-300 rounded-full animate-bounce mx-0.5"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </span>
        </span>
      </div>

      {/* Character counter */}
      <div className={joinClasses(
        "absolute -top-6 right-4 text-xs",
        charCount > maxChars ? "text-red-400" :
        charCount > maxChars * 0.8 ? "text-orange-400" :
        charCount > maxChars * 0.6 ? "text-yellow-400" :
        "text-gray-400"
      )}>
        {charCount}/{maxChars}
      </div>

      <div className="flex items-center gap-2 relative">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="sr-only"
          maxLength={maxChars + 1}
        />

        <div
          onClick={handleContainerClick}
          className={joinClasses(
            "h-12 rounded-full text-sm px-6 py-3 flex-1 cursor-text",
            "flex items-center overflow-x-auto whitespace-nowrap",
            "transition-all duration-300 bg-[#2e2e2e]",
            isFocused ? "ring-2 ring-[#22ffff] ring-offset-2 ring-offset-[#2e2e2e]" : "ring-1 ring-[#4a4a4a]",
            charCount > maxChars && "ring-2 ring-red-500"
          )}
        >
          {displayText.length > 0 ? (
            displayText.map((letter, index) => (
              <span
                key={index}
                className={joinClasses(
                  "inline-block transition-all duration-200 origin-bottom text-white/90",
                  "animate-in fade-in-0 slide-in-from-bottom-2",
                  letter !== ' ' && "hover:text-[#22ffff] hover:-translate-y-1"
                )}
                style={{
                  animationDelay: `${index * 20}ms`,
                  animationDuration: '200ms'
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Type your message...</span>
          )}
        </div>

                  <button
          onClick={handleSend}
          onMouseEnter={() => {
            setIsHovered(true);
            onSendHover?.(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            onSendHover?.(false);
          }}
          disabled={!inputText.trim() || charCount > maxChars}
          className={`btn ${inputText.trim() && charCount <= maxChars ? 'active' : ''}`}
        >
          <Send className={joinClasses(
            "w-5 h-5 transition-all duration-200 relative z-10",
            isTyping && "translate-x-0.5"
          )} />
        </button>

        <style jsx>{`
          .btn {
            width: 44px;
            height: 44px;
            border-radius: 0.875em;
            display: flex;
            align-items: center;
            justify-center: center;
            position: relative;
            background: transparent;
            color: white;
            border: none;
            outline: none;
            cursor: pointer;
            transition: all 0.25s ease;
            z-index: 1;
            box-shadow: inset 0 0px 0px 0.5px rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0.03) 0px 0.25em 0.3em -1px,
              rgba(0, 0, 0, 0.02) 0px 0.15em 0.25em -1px;
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
            opacity: 0.5;
            cursor: not-allowed;
          }

          @keyframes shine {
            0%, 100% {
              opacity: 1;
              box-shadow: 0 0 30px rgba(34, 255, 255, 0.5),
                         0 0 20px rgba(60, 100, 255, 0.3),
                         0 0 10px rgba(192, 58, 252, 0.2);
            }
            50% {
              opacity: 0.7;
              box-shadow: 0 0 40px rgba(34, 255, 255, 0.6),
                         0 0 30px rgba(60, 100, 255, 0.4),
                         0 0 20px rgba(192, 58, 252, 0.3);
            }
          }

          @keyframes rotate {
            from {
              --mask: 0deg;
            }
            to {
              --mask: 360deg;
            }
          }

          .btn:not(:disabled):active {
            scale: 0.95;
          }

          @property --mask {
            syntax: '<angle>';
            inherits: false;
            initial-value: 30deg;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
              scale: 1;
              --mask: 30deg;
            }
            70% {
              --mask: 390deg;
            }
            85% {
              opacity: 0.4;
              scale: 0.96 0.9;
            }
            100% {
              --mask: 390deg;
            }
          }

          .btn.active {
            animation: 2s ease-in-out pulse infinite both;
          }
        `}</style>
      </div>
    </div>
  );
};

export default InputChatInterface;