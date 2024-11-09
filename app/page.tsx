"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ThumbsUp, ThumbsDown, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Simple utility function to merge className strings
const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Como posso ajudar você hoje? 😊", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState("");
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [isUserInfoSubmitted, setIsUserInfoSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  const botResponses = [
    "Entendi! 🤔 Deixe-me ver o que posso fazer...",
    "Certo! 👍 Vou procurar a melhor resposta para você.",
    "A caminho! 🚀 Já estou buscando informações relevantes.",
    "Interessante! ✨ Vou tentar encontrar a solução ideal."
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: inputText, sender: "user" },
      ]);

      setTimeout(() => {
        const randomResponse =
          botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, text: randomResponse, sender: "bot" },
        ]);
      }, 1000);

      setInputText("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", { rating, feedbackText });
    setShowFeedbackSuccess(true);
    setTimeout(() => {
      setShowFeedbackSuccess(false);
      setIsDialogOpen(false);
      setFeedbackText("");
      setRating("");
    }, 3000);
  };

  const resetFeedback = () => {
    setFeedbackText("");
    setRating("");
    setShowFeedbackSuccess(false);
  };

  const handleUserInfoSubmit = () => {
    if (userInfo.name && userInfo.email) {
      setIsUserInfoSubmitted(true);
    }
  };

  if (!isUserInfoSubmitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Por favor, insira seus dados</CardTitle>
            <CardDescription>
              Precisamos das suas informações para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                placeholder="Digite seu nome"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                placeholder="Digite seu email"
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleUserInfoSubmit} 
              className="w-full"
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-4xl h-[600px] md:h-[700px] flex flex-col relative">
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border-2 border-primary bg-primary/10">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Assistente Virtual - {userInfo.name}</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetFeedback(); }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nos conte sua experiência!</DialogTitle>
                  <CardDescription>
                    Seu feedback nos ajuda a melhorar! 😊
                  </CardDescription>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <RadioGroup value={rating} onValueChange={setRating} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="positive" id="positive" />
                      <Label htmlFor="positive" className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> Positivo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="negative" id="negative" />
                      <Label htmlFor="negative" className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" /> Negativo
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Comentários adicionais</Label>
                    <Textarea
                      id="feedback"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Compartilhe sua experiência..."
                      className="resize-none h-20"
                    />
                  </div>
                </div>
                {showFeedbackSuccess && (
                  <Alert className="mx-4 mb-4">
                    <AlertDescription>
                      Feedback enviado com sucesso! 🎉 Muito obrigado! 🙏
                    </AlertDescription>
                  </Alert>
                )}
                <DialogFooter className="px-4 pb-4">
                  <Button onClick={handleFeedbackSubmit}>
                    Enviar Feedback
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative">
          <ScrollArea className="h-[calc(100%-2rem)] px-4 py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={mergeClasses("flex mb-4",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={mergeClasses("flex items-start gap-2 max-w-[80%]",
                  message.sender === "user" ? "flex-row-reverse" : ""
                )}>
                  <Avatar className={mergeClasses("h-8 w-8",
                    message.sender === "bot" 
                      ? "bg-primary/10 border-2 border-primary" 
                      : "bg-muted"
                  )}>
                    <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={mergeClasses("rounded-lg p-3 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <div className="border-t p-4">
          <div className="flex items-center gap-2 relative">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-4 py-6 h-12 rounded-full bg-muted/50"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Smile className="h-5 w-5" />
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full h-12 w-12 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;