"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import ChatInterface from '@/components/ui/ChatInterface';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Coffee, Send, Smile } from "lucide-react";

const UserInfoForm = ({ onSubmit }) => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [greeting, setGreeting] = useState('👋 Oi! Vamos começar?');

  // Fun greetings based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('☀️ Bom dia! Pronto para uma conversa?');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('👋 Boa tarde! Que tal batermos um papo?');
    } else {
      setGreeting('🌙 Boa noite! Ainda bem que você apareceu!');
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    // Update greeting based on field focus
    if (field === 'name') {
      setGreeting('😊 Como você se chama?');
    } else if (field === 'email') {
      setGreeting('📧 Precisamos manter contato!');
    }
  };

  const handleBlur = () => {
    setFocusedField(null);
    if (userInfo.name) {
      setGreeting(`✨ Prazer em conhecer você, ${userInfo.name}!`);
    }
  };

  useEffect(() => {
    const newErrors = { name: '', email: '' };
    
    if (userInfo.name && !validateName(userInfo.name)) {
      newErrors.name = 'Ops! Nome muito curto';
    }
    
    if (userInfo.email && !validateEmail(userInfo.email)) {
      newErrors.email = 'Hmm... Este email parece diferente';
    }
    
    setErrors(newErrors);
  }, [userInfo]);

  const handleSubmit = async () => {
    if (!validateName(userInfo.name) || !validateEmail(userInfo.email)) {
      return;
    }

    setIsLoading(true);
    setGreeting('🚀 Preparando tudo para você...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setGreeting(`🎉 Tudo pronto, ${userInfo.name}!`);
      
      setTimeout(() => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setSubmitted(true);
      }, 1500);
      
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Algo deu errado. Vamos tentar de novo?' }));
      setGreeting('😅 Opa! Tivemos um pequeno contratempo...');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    if (onSubmit) {
      onSubmit(userInfo);
    }
    return <ChatInterface />; // ChatInterface will get user info from localStorage
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-2xl font-semibold">Vamos conversar?</CardTitle>
          </div>
          <CardDescription className="text-lg animate-in slide-in-from-bottom-2">
            {greeting}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 animate-in slide-in-from-bottom-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-base">
                Nome
                {userInfo.name && validateName(userInfo.name) && (
                  <Smile className="w-4 h-4 text-green-500 animate-in zoom-in" />
                )}
              </Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                placeholder="Como prefere ser chamado?"
                className={`text-base transition-all duration-300 ${
                  focusedField === 'name' ? 'scale-[1.02] shadow-md' : ''
                } ${errors.name ? 'border-red-300 bg-red-50' : ''}`}
              />
              {errors.name && (
                <div className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-base">
                Email
                {userInfo.email && validateEmail(userInfo.email) && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in" />
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                placeholder="Seu melhor email"
                className={`text-base transition-all duration-300 ${
                  focusedField === 'email' ? 'scale-[1.02] shadow-md' : ''
                } ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
              />
              {errors.email && (
                <div className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {isSuccess && (
              <Alert className="bg-green-50 border-green-200 animate-in slide-in-from-bottom">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Perfeito! Estamos quase lá...
                </AlertDescription>
              </Alert>
            )}

            {errors.submit && (
              <Alert variant="destructive" className="animate-in slide-in-from-bottom">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !validateEmail(userInfo.email) || !validateName(userInfo.name)}
              className={`w-full h-12 text-base transition-all duration-300 ${
                isLoading ? 'bg-gray-400' : 
                validateEmail(userInfo.email) && validateName(userInfo.name) 
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-[1.02]' 
                  : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparando...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Pronto!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Vamos lá!
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfoForm;