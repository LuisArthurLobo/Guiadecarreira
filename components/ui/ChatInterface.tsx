import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputChatInterface from '@/components/ui/InputChatInterface';
import EmojiAvatar from '@/components/ui/EmojiAvatar';

const joinClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const ChatInterface = ({ onLogout }) => {
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [lastTextLength, setLastTextLength] = useState(0);
  const [currentInputText, setCurrentInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const botResponses = [
    "I understand! 🤔 Let me see what I can do...",
    "Got it! 👍 Looking for the best answer for you.",
    "On it! 🚀 Searching for relevant information.",
    "Interesting! ✨ I'll try to help in the best way possible!"
  ];

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      setMessages([
        { 
          id: 1, 
          text: `Hello ${parsedUserInfo.name}! Great to see you here! 😊 How can I help you today?`, 
          sender: "bot" 
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (lastTextLength > 0 && currentInputText.length === 0) {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 500);
    }
    setLastTextLength(currentInputText.length);
  }, [currentInputText]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputClick = () => {
    setShouldBounce(true);
    setTimeout(() => setShouldBounce(false), 500);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    setShouldBounce(true);
    setTimeout(() => setShouldBounce(false), 500);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleInputChange = (text) => {
    setCurrentInputText(text);
  };

  const handleCopyMessage = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSendMessage = async (text) => {
    if (text.trim() === "") return;
    
    const newUserMessageId = messages.length + 1;
    setMessages(prevMessages => [
      ...prevMessages,
      { id: newUserMessageId, text, sender: 'user' },
    ]);

    setTypingMessageId(newUserMessageId + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prevMessages => [
        ...prevMessages,
        { id: newUserMessageId + 1, text: botResponse, sender: 'bot' },
      ]);
    } finally {
      setTypingMessageId(null);
    }
  };

  const getUserInitials = () => {
    if (!userInfo?.name) return 'U';
    return userInfo.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4">
      <Card className="w-full max-w-lg transform transition-all duration-300 bg-[#3a3a3a] border-none shadow-[inset_0_0px_0px_0.5px_rgba(0,0,0,0.2),rgba(0,0,0,0.03)_0px_0.25em_0.3em_-1px,rgba(0,0,0,0.02)_0px_0.15em_0.25em_-1px]">
        <CardHeader className="space-y-1 border-b border-[#4a4a4a] pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">AI Assistant</CardTitle>
            <Dialog>
              <DialogTrigger>
                <Avatar className="h-8 w-8 bg-[#4a4a4a] border border-[#5a5a5a] transition-all duration-300 hover:scale-110">
                  <AvatarFallback className="text-white bg-transparent">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent className="bg-[#3a3a3a] border-[#4a4a4a] text-white">
                <DialogHeader>
                  <DialogTitle>User Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{userInfo?.name}</span>
                  </div>
                  <button onClick={onLogout} className="text-red-400 hover:text-red-300">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={joinClasses(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={joinClasses(
                    "flex items-end space-x-2 group",
                    message.sender === 'user' ? "flex-row-reverse space-x-reverse" : ""
                  )}>
                    {message.sender === 'user' ? (
                      <Avatar className="h-8 w-8 bg-[#4a4a4a] border border-[#5a5a5a] transition-transform hover:scale-110">
                        <AvatarFallback className="text-white bg-transparent">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <EmojiAvatar 
                        isTyping={typingMessageId === message.id}
                        shouldBounce={shouldBounce}
                        isFocused={inputFocused}
                        isSendHovered={isSendHovered}
                      />
                    )}
                    <div 
                      onClick={() => handleCopyMessage(message.text, message.id)}
                      className={joinClasses(
                        "chat-bubble relative px-4 py-2 rounded-2xl max-w-md break-words cursor-pointer select-all",
                        message.sender === 'user' ? "user-bubble" : "bot-bubble"
                      )}
                    >
                      {message.text}
                      <div className={joinClasses(
                        "copy-indicator absolute -right-2 -top-2 p-1 rounded-full transition-all duration-300",
                        copiedMessageId === message.id ? "opacity-100 scale-100" : "opacity-0 scale-0",
                        "group-hover:opacity-100 group-hover:scale-100"
                      )}>
                        {copiedMessageId === message.id ? (
                          <div className="bg-green-500/90 text-white p-1 rounded-full shadow-lg">
                            <Check className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="bg-gray-700/90 text-white p-1 rounded-full shadow-lg hover:bg-gray-600/90">
                            <Copy className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-[#4a4a4a] bg-[#2e2e2e] p-4 rounded-b-xl">
            <InputChatInterface 
              onSend={handleSendMessage}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              onSendHover={setIsSendHovered}
            />
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .chat-bubble {
          position: relative;
          transform: scale(1);
          z-index: 1;
          isolation: isolate;
          transition: all 0.3s var(--spring-easing);
        }

        .chat-bubble::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: conic-gradient(
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
          border-radius: inherit;
          z-index: -2;
          opacity: 0;
          transition: all 0.3s ease;
          filter: blur(0.5em);
        }

        .chat-bubble::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          transition: all 0.3s ease;
        }

        .user-bubble {
          background: linear-gradient(135deg, #22ffff 0%, #3c64ff 100%);
          color: white;
          box-shadow: rgba(34, 255, 255, 0.1) 0px 4px 12px;
        }

        .bot-bubble {
          background: #4a4a4a;
          color: white;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }

        .chat-bubble:active {
          transform: scale(0.98);
        }

        .group:hover .chat-bubble {
          transform: scale(1.02);
        }

        .group:hover .user-bubble::before {
          opacity: 0.5;
          animation: pulse 2s ease-in-out infinite;
        }

        .group:hover .bot-bubble {
          background: #5a5a5a;
        }

        .copy-indicator {
          transform-origin: top right;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          animation: copySuccess 0.3s var(--spring-easing) forwards;
        }

        /* Spring animation for smooth transitions */
        :root {
          --spring-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @property --mask {
          syntax: "<angle>";
          inherits: false;
          initial-value: 30deg;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            --mask: 30deg;
            filter: blur(0.5em);
          }
          50% {
            opacity: 0.5;
            --mask: 110deg;
            filter: blur(1em);
          }
        }

        @keyframes copySuccess {
          0% {
            transform: scale(0) rotate(-90deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;