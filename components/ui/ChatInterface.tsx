import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputChatInterface from '@/components/ui/InputChatInterface';
import UserProfile from '@/components/ui/UserProfile';
import { UserChatBubble, BotChatBubble } from '@/components/ui/ChatBubble';
import CareerPromptsDialog from '@/components/ui/CareerPromptsDialog';

const ChatInterface = ({ onLogout }) => {
  // State Management
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [lastTextLength, setLastTextLength] = useState(0);
  const [currentInputText, setCurrentInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isPromptsDialogOpen, setIsPromptsDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const botResponses = [
    "I understand! 🤔 Let me see what I can do...",
    "Got it! 👍 Looking for the best answer for you.",
    "On it! 🚀 Searching for relevant information.",
    "Interesting! ✨ I'll try to help in the best way possible!"
  ];

  // Effects
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      setMessages([{
        id: 1,
        text: <>
          Welcome {parsedUserInfo.name}! 👋 I'm your career guidance assistant.{' '}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsPromptsDialogOpen(true);
            }}
            className="underline text-[#22ffff] hover:text-[#3c64ff] transition-colors duration-200 font-medium"
          >
            Click here to choose a topic
          </button> you'd like to discuss!
        </>,
        sender: "bot"
      }]);
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

  // Handlers
  const handlePromptSelect = (selectedPrompt) => {
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: selectedPrompt,
        sender: 'user'
      },
      {
        id: prev.length + 2,
        text: "That's a great topic! Let's explore it together. Can you tell me more about your thoughts on this?",
        sender: 'bot'
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSendMessage = async (text) => {
    if (text.trim() === "") return;
    
    const newUserMessageId = messages.length + 1;
    setMessages(prev => [...prev, { id: newUserMessageId, text, sender: 'user' }]);
    setTypingMessageId(newUserMessageId + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { id: newUserMessageId + 1, text: botResponse, sender: 'bot' }]);
    } finally {
      setTypingMessageId(null);
    }
  };

  const handleCopyMessage = async (text, messageId) => {
    try {
      const textToCopy = typeof text === 'string' ? text : text.props.children.join('');
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
        {/* Header Section */}
        <CardHeader className="space-y-1 border-b border-[#4a4a4a] pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">AI Assistant</CardTitle>
            <UserProfile onLogout={onLogout} />
          </div>
        </CardHeader>

        {/* Chat Content */}
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                message.sender === 'user' ? (
                  <UserChatBubble
                    key={message.id}
                    message={message}
                    userInitials={getUserInitials()}
                    copiedMessageId={copiedMessageId}
                    onCopy={handleCopyMessage}
                  />
                ) : (
                  <BotChatBubble
                    key={message.id}
                    message={message}
                    isTyping={typingMessageId === message.id}
                    shouldBounce={shouldBounce}
                    isFocused={inputFocused}
                    isSendHovered={isSendHovered}
                    copiedMessageId={copiedMessageId}
                    onCopy={handleCopyMessage}
                  />
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Section */}
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

      <CareerPromptsDialog
        isOpen={isPromptsDialogOpen}
        onClose={() => setIsPromptsDialogOpen(false)}
        onSelectPrompt={handlePromptSelect}
      />
    </div>
  );
};

export default ChatInterface;