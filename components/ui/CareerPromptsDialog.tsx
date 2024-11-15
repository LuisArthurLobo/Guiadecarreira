import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart,
  Star,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Users,
} from "lucide-react";

interface CareerPromptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const CareerPromptsDialog = ({ isOpen, onClose, onSelectPrompt }: CareerPromptsDialogProps) => {
  const promptCategories = [
    {
      icon: <Star className="w-5 h-5 text-emerald-400" />,
      title: "Your Unique Journey",
      description: "Celebrate your path forward",
      gradient: "from-emerald-500/20 to-cyan-500/20",
      prompts: [
        "What achievements make your heart swell with pride?",
        "Where do you see yourself making the most meaningful impact?",
        "What challenges would you like to transform into opportunities?"
      ]
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-rose-400" />,
      title: "Learning & Growth",
      description: "Nurture your professional journey",
      gradient: "from-rose-500/20 to-orange-500/20",
      prompts: [
        "What knowledge would empower you to reach your dreams?",
        "How would you like to grow and evolve professionally?",
        "What skills would help you make a bigger impact?"
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl h-[90vh] sm:h-auto bg-gradient-to-b from-[#2a2a2a] to-[#222] border-white/10 text-white p-0 flex flex-col">
        {/* Header Section - Fixed at top */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/5 bg-[#2e2e2e] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Shape Your Journey
              </span>
              <Sparkles className="w-4 h-4 text-white/60 animate-pulse" />
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Message */}
          <div className="px-4 sm:px-6 pt-4">
            <div className="rounded-lg bg-[#2e2e2e] border-[#3a3a3a] border p-3 sm:p-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/60">
                  Choose a prompt and vamos explore your journey together ✨
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promptCategories.map((category, idx) => (
                <div key={idx} className="group">
                  <Card className="bg-[#2e2e2e] hover:bg-[#333] border-[#3a3a3a] overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                            {category.title}
                          </h3>
                          <p className="text-xs text-white/60">{category.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {category.prompts.map((prompt, promptIdx) => (
                          <button
                            key={promptIdx}
                            onClick={() => {
                              onSelectPrompt(prompt);
                              onClose();
                            }}
                            className="w-full text-left p-3 rounded-lg text-sm bg-[#252525] hover:bg-[#2a2a2a] 
                              border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all duration-300 
                              flex items-center gap-2 group/prompt relative overflow-hidden"
                          >
                            <Lightbulb className="w-4 h-4 shrink-0 text-white/60 group-hover/prompt:text-white transition-colors duration-300" />
                            <span className="text-white/80 group-hover/prompt:text-white transition-colors duration-300">
                              {prompt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Inspiration Message */}
            <div className="rounded-lg bg-[#2e2e2e] border-[#3a3a3a] border p-4 relative overflow-hidden group
              shadow-[0px_0px_0px_1px_rgba(165,165,165,0.04),-4px_4px_4px_-0.5px_rgba(0,0,0,0.04),-8px_8px_8px_-1.5px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-white/80 leading-relaxed relative z-10">
                Every career journey is unique and beautiful – like a story waiting to be told. vamoss explore your professional path together, understanding your dreams, and crafting the next chapter of your career with purpose and passion.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerPromptsDialog;