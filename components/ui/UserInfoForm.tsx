import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Send, Smile } from "lucide-react";
import Confetti from '@/components/ui/Confetti';

const UserInfoForm = ({ onSubmit }) => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [greeting, setGreeting] = useState('👋 Welcome!');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('🌅 Good morning! Ready to chat?');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('☀️ Good afternoon! Let\'s talk!');
    } else {
      setGreeting('🌙 Good evening! Perfect time for a chat!');
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
    if (field === 'name') {
      setGreeting('😊 What should I call you?');
    } else if (field === 'email') {
      setGreeting('📧 Let\'s stay connected!');
    }
  };

  const handleBlur = () => {
    setFocusedField(null);
    if (userInfo.name) {
      setGreeting(`✨ Nice to meet you, ${userInfo.name}!`);
    }
  };

  const handleSubmit = async () => {
    if (!validateName(userInfo.name) || !validateEmail(userInfo.email)) return;

    setIsLoading(true);
    setGreeting('🚀 Getting everything ready...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setGreeting(`🎉 All set, ${userInfo.name}!`);
      setShowConfetti(true);
      
      setTimeout(() => {
        if (onSubmit) onSubmit(userInfo);
      }, 1000);
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Something went wrong. Let\'s try again?' }));
      setGreeting('😅 Oops! A little hiccup...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4">
      <Confetti active={showConfetti} />
      
      <Card className="w-full max-w-md transform transition-all duration-300 bg-[#3a3a3a] border-none shadow-[inset_0_0px_0px_0.5px_rgba(0,0,0,0.2),rgba(0,0,0,0.03)_0px_0.25em_0.3em_-1px,rgba(0,0,0,0.02)_0px_0.15em_0.25em_-1px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            Let's Chat
          </CardTitle>
          <CardDescription className="text-lg font-medium text-gray-300">
            {greeting}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white flex items-center gap-2">
                Name
                {userInfo.name && validateName(userInfo.name) && (
                  <Smile className="w-4 h-4 text-green-500 animate-bounce" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  placeholder="What should we call you?"
                  className={`pl-4 h-11 bg-[#2e2e2e] text-white border-none transition-all duration-300
                    ${focusedField === 'name' ? 'ring-2 ring-[#22ffff] ring-offset-2 ring-offset-[#3a3a3a] scale-105' : ''}
                    ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <div className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                Email
                {userInfo.email && validateEmail(userInfo.email) && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 animate-bounce" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={`pl-4 h-11 bg-[#2e2e2e] text-white border-none transition-all duration-300
                    ${focusedField === 'email' ? 'ring-2 ring-[#22ffff] ring-offset-2 ring-offset-[#3a3a3a] scale-105' : ''}
                    ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-left">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Success Message */}
            {isSuccess && (
              <Alert className="bg-green-500/20 border-green-500/30 text-green-300">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <AlertDescription>
                  Perfect! Just a moment...
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !validateEmail(userInfo.email) || !validateName(userInfo.name)}
              className={`btn w-full h-12 text-base font-medium transition-all duration-300 relative group
                ${isLoading ? 'opacity-50' : ''}
                ${validateEmail(userInfo.email) && validateName(userInfo.name) && !isLoading
                  ? 'active' 
                  : 'opacity-70'
                }`}
            >
              <span className="text-white flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Getting Ready...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    All Set!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Let's Begin!
                  </>
                )}
              </span>
            </button>

            <style jsx>{`
              .btn {
                border-radius: 0.875em;
                box-shadow: inset 0 0px 0px 0.5px rgba(0, 0, 0, 0.2),
                  rgba(0, 0, 0, 0.03) 0px 0.25em 0.3em -1px,
                  rgba(0, 0, 0, 0.02) 0px 0.15em 0.25em -1px;
                position: relative;
                background: transparent;
                outline: none;
                border: none;
                transform: scale(1);
                z-index: 1;
              }
              
              .btn::before {
                content: "";
                position: absolute;
                inset: 0em;
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
                filter: blur(0.5em);
                z-index: -2;
                opacity: 0.4;
                scale: 0.96 0.9;
                border-radius: 0.75em;
                transition: all 0.25s ease;
              }
              
              .btn:after {
                z-index: -1;
                content: "";
                position: absolute;
                inset: 0;
                background: rgba(255, 255, 255, 0.2);
                box-shadow: inset 0 1px 0px 0px rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0px 0px rgba(255, 255, 255, 0.6);
                border-radius: 0.875em;
                transition: all 0.25s ease;
              }
              
              .btn:hover::before,
              .btn:focus::before {
                opacity: 0.6;
                scale: 1;
                filter: blur(1em);
              }
              
              .btn:focus::before,
              .btn.active::before {
                animation: 2s ease-in-out pulse infinite both;
              }
              
              .btn:hover::after,
              .btn:focus::after,
              .btn.active::after {
                background: rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(30px);
                box-shadow: inset 0 1px 0px 0px rgba(255, 255, 255, 0.66),
                  inset 0 -1px 0px 0px rgba(255, 255, 255, 0.5);
              }
              
              @property --mask {
                syntax: "<angle>";
                inherits: false;
                initial-value: 30deg;
              }
              
              @keyframes pulse {
                0%,
                100% {
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
            `}</style>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfoForm;