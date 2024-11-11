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
import { LogOut, Settings, User } from "lucide-react";
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
  const messagesEndRef = useRef(null);

  const botResponses = [
    "Entendi! 🤔 Deixe-me ver o que posso fazer...",
    "Certo! 👍 Vou procurar a melhor resposta para você.",
    "A caminho! 🚀 Já estou buscando informações relevantes.",
    "Interessante! ✨ Vou tentar ajudar da melhor forma possível!"
  ];

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      setMessages([
        { 
          id: 1, 
          text: `Olá ${parsedUserInfo.name}! Que bom te ver por aqui! 😊 Como posso ajudar você hoje?`, 
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

  const handleSendMessage = (text) => {
    if (text.trim() === "") return;
    
    const newUserMessageId = messages.length + 1;
    setMessages(prevMessages => [
      ...prevMessages,
      { id: newUserMessageId, text, sender: 'user' },
    ]);

    setTypingMessageId(newUserMessageId + 1);

    setTimeout(() => {
      const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prevMessages => [
        ...prevMessages,
        { id: newUserMessageId + 1, text: botResponse, sender: 'bot' },
      ]);
      setTypingMessageId(null);
    }, 1000);
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
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chat Assistente</CardTitle>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Perfil do Usuário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-medium">Nome:</span>
                  <span>{userInfo?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  <span className="font-medium">Email:</span>
                  <span>{userInfo?.email}</span>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={onLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sair
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={joinClasses(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}>
                <div className={joinClasses(
                  "flex items-center space-x-2",
                  message.sender === 'user' ? "flex-row-reverse" : ""
                )}>
                  {message.sender === 'user' ? (
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <EmojiAvatar 
                      isTyping={typingMessageId === message.id}
                      shouldBounce={shouldBounce}
                      isFocused={inputFocused}
                      isSendHovered={isSendHovered}
                    />
                  )}
                  <div className={joinClasses(
                    "p-3 rounded-lg max-w-md break-words",
                    message.sender === 'user' ? "bg-blue-500 text-white" : "bg-gray-100"
                  )}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <InputChatInterface 
          onSend={handleSendMessage}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onSendHover={setIsSendHovered}
        />
      </CardContent>
    </Card>
  );
};

export default ChatInterface;