
"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="border-t p-4 bg-white">
      <div className="relative">
        {/* Typing indicator */}
        <div className={joinClasses(
          "absolute -top-6 left-4 text-xs text-gray-500 transition-opacity duration-200",
          isTyping ? "opacity-100" : "opacity-0"
        )}>
          <span className="inline-flex items-center gap-2">
            Typing
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce mx-0.5"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </span>
          </span>
        </div>

        {/* Character counter */}
        <div className={joinClasses(
          "absolute -top-6 right-4 text-xs",
          charCount > maxChars ? "text-red-500" :
          charCount > maxChars * 0.8 ? "text-orange-500" :
          charCount > maxChars * 0.6 ? "text-yellow-500" :
          "text-gray-500"
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
              "h-12 rounded-full text-sm px-12 py-3 flex-1 cursor-text",
              "flex items-center overflow-x-auto whitespace-nowrap",
              isTyping ? "border-blue-400 bg-blue-50" : "border-0 bg-gray-100",
              charCount > maxChars && "border-red-400 bg-red-50"
            )}
          >
            {displayText.length > 0 ? (
              displayText.map((letter, index) => (
                <span
                  key={index}
                  className={joinClasses(
                    "inline-block transition-all duration-200 origin-bottom",
                    "animate-in fade-in-0 slide-in-from-bottom-2",
                    letter !== ' ' && "hover:text-blue-500 hover:-translate-y-1"
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
              <span className="text-gray-400">Digite sua mensagem...</span>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            onClick={handleSend}
            onMouseEnter={() => onSendHover?.(true)}
            onMouseLeave={() => onSendHover?.(false)}
            disabled={!inputText.trim() || charCount > maxChars}
            className={joinClasses(
              "bg-blue-500 text-white rounded-lg",
              "hover:bg-blue-600 active:bg-blue-700",
              "shadow-md hover:shadow-lg",
              isTyping && "scale-110",
              !inputText.trim() && "opacity-50"
            )}
          >
            <Send className={joinClasses(
              "w-4 h-4 transition-transform duration-200",
              isTyping && "translate-x-0.5"
            )} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputChatInterface;