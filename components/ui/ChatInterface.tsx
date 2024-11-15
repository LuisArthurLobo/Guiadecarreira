import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputChatInterface from '@/components/ui/InputChatInterface';
import UserProfile from '@/components/ui/UserProfile';
import ChatBubble from '@/components/ui/ChatBubble';
import CareerPromptsDialog from '@/components/ui/CareerPromptsDialog';
import geminiService from '@/geminiService.js';

interface Message {
  id: string;
  text: string | ReactNode;
  sender: 'user' | 'bot';
  isHtml?: boolean;
  isMarkdown?: boolean;
}

interface UserInfo {
  name: string;
}

const ChatInterface: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [lastTextLength, setLastTextLength] = useState(0);
  const [currentInputText, setCurrentInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isPromptsDialogOpen, setIsPromptsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      setMessages([{
        id: '1',
        text: `Hi, ${parsedUserInfo.name}! 👋 Ill help you with Design and digital products. Click here to see some topics or ask anything in the chat.`,
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
  }, [currentInputText, lastTextLength]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptSelect = async (selectedPrompt: string) => {
    const newUserMessageId = String(messages.length + 1);
    
    setMessages(prev => [
      ...prev,
      {
        id: newUserMessageId,
        text: selectedPrompt,
        sender: 'user'
      }
    ]);

    setTypingMessageId(String(messages.length + 2));
    setIsGenerating(true);

    try {
      const response = await geminiService.generateResponse(selectedPrompt);
      setMessages(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          text: response,
          sender: 'bot',
          isHtml: true
        }
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          text: "I apologize, but I encountered an error. Please try again.",
          sender: 'bot'
        }
      ]);
    } finally {
      setTypingMessageId(null);
      setIsGenerating(false);
    }
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

  const handleInputChange = (text: string) => {
    setCurrentInputText(text);
  };

  const handleSendMessage = async (text: string) => {
    if (text.trim() === "" || isGenerating) return;
    
    const newUserMessageId = String(messages.length + 1);
    setMessages(prev => [...prev, { 
      id: newUserMessageId, 
      text, 
      sender: 'user' 
    }]);

    setTypingMessageId(String(Number(newUserMessageId) + 1));
    setIsGenerating(true);

    try {
      const response = await geminiService.generateResponse(text);
      setMessages(prev => [...prev, { 
        id: String(Number(newUserMessageId) + 1), 
        text: response,
        sender: 'bot',
        isMarkdown: true 
      }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        id: String(Number(newUserMessageId) + 1), 
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'bot'
      }]);
    } finally {
      setTypingMessageId(null);
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
        <CardHeader className="space-y-1 border-b border-[#4a4a4a] pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">Gemini Assistant</CardTitle>
            <UserProfile onLogout={onLogout} />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  type={message.sender}
                  userInitials={getUserInitials()}
                  isTyping={typingMessageId === message.id}
                  shouldBounce={shouldBounce}
                  isFocused={inputFocused}
                  isSendHovered={isSendHovered}
                  copiedMessageId={copiedMessageId}
                  onCopy={handleCopyMessage}
                />
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
              disabled={isGenerating}
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