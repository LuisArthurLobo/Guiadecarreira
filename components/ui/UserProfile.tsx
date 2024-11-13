import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Gift, Heart, Sparkles, Users2 } from "lucide-react";

const UserProfile = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning ☀️');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon ⛅');
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening 🌅');
    } else {
      setGreeting('Good night 🌙');
    }
  }, []);

  const getUserInitials = () => {
    if (!userInfo?.name) return '👤';
    
    const names = userInfo.name.trim().split(' ');
    if (names.length === 0) return '👤';
    
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    
    return (firstInitial + lastInitial)
      .toUpperCase()
      .slice(0, 2)
      .padEnd(2, firstInitial.toUpperCase());
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Avatar className="h-9 w-9 bg-[#2e2e2e] text-white border border-white/10 transition-all duration-300 hover:border-white/20 hover:scale-105">
          <AvatarFallback className="bg-[#2e2e2e] text-sm font-medium">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      
      <DialogContent className="w-full max-w-md bg-gradient-to-b from-[#2a2a2a] to-[#222] border-white/10 text-white p-0 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/5">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium flex items-center gap-2">
              <span>{greeting}</span>
              <div className="w-px h-4 bg-white/20" />
              <span className="text-white/80">{userInfo?.name}</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Enhanced Message Section */}
          <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-br from-white/5 to-white/10 p-6 border border-white/10 relative overflow-hidden group">
              {/* Ambient Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Header with Enhanced Icon */}
              <div className="flex items-center gap-3 mb-4 relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-5 w-5 text-white/60 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-base font-medium text-white flex items-center gap-2 relative">
                  <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">A Letter to Product Creators</span>
                  <Sparkles className="h-4 w-4 text-white/60 animate-pulse" />
                </div>
              </div>

              {/* Enhanced Message Content */}
              <div className="space-y-4 relative">
                <p className="text-sm text-white/90 leading-relaxed tracking-wide group">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-white/90 group-hover:text-white transition-colors duration-300">Lets together</span>
                    <Users2 className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
                  </span>
                  {" "}create a better world by design – with a relentless pursuit of crafting experiences that matter, bringing to this world{" "}
                  <span className="relative inline-block group/inspire">
                    <span className="relative z-10 text-cyan-300/90 group-hover/inspire:text-cyan-200 transition-colors duration-300">products that brings joy, inspires</span>
                    <span className="absolute inset-0 bg-cyan-400/10 rounded-full blur-xl opacity-0 group-hover/inspire:opacity-100 transition-opacity duration-500" />
                  </span>
                  ,{" "}
                  <span className="relative inline-block group/soul">
                    <span className="relative z-10 text-purple-300/90 group-hover/soul:text-purple-200 transition-colors duration-300">products with soul</span>
                    <span className="absolute inset-0 bg-purple-400/10 rounded-full blur-xl opacity-0 group-hover/soul:opacity-100 transition-opacity duration-500" />
                  </span>
                  .
                </p>
                <p className="text-sm text-white/80 leading-relaxed tracking-wide">
                  I'll always be here to help you nurture that spark with this assistant – completely free, today and always.
                </p>
                <div className="pt-2 flex items-center justify-end gap-2 text-sm text-white/60">
                  <span>with love,</span>
                  <span className="font-medium text-white/90">Luis Arthur Lobo</span>
                  <span className="text-rose-400/80">❤️</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Enhanced Logout Button */}
          <div className="pt-2">
            <button 
              onClick={onLogout}
              className="relative w-full h-12 group"
            >
              <div className="absolute inset-0 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 transform group-hover:-translate-y-full">
                    <span className="flex items-center gap-2 text-white/80 group-hover:text-white">
                      <span className="text-sm">Sign out</span>
                      <LogOut className="w-4 h-4" />
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                    <span className="flex items-center gap-2 text-white/80 group-hover:text-white">
                      <span className="text-sm">See you soon</span>
                      <span className="text-sm">✨</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-500/40 transition-all duration-300" />
            </button>
          </div>

          {/* Enhanced Footer Message */}
          <div className="text-center">
            <p className="text-xs text-white/40">
              Looking forward to our next chat! 💫
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;