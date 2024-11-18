import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, Copy } from "lucide-react";
import EmojiAvatar from '@/components/ui/EmojiAvatar';

const joinClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const UserChatBubble = ({
  message,
  userInitials,
  copiedMessageId,
  onCopy
}) => {
    return (
    <div className="flex justify-end">
      <div className="flex items-end space-x-2 flex-row-reverse space-x-reverse group">
        <Avatar className="h-8 w-8 bg-[#4a4a4a] border border-[#5a5a5a] transition-transform hover:scale-110">
          <AvatarFallback className="text-white bg-transparent">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <ChatBubbleContent
          message={message}
          copiedMessageId={copiedMessageId}
          onCopy={onCopy}
          isBot={false}
        />
      </div>
    </div>
  );
};

export const BotChatBubble = ({
  message,
  isTyping,
shouldBounce, 
  isFocused, 
  isSendHovered, 
  copiedMessageId,
  onCopy
}) => {
    return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2 group">
        <EmojiAvatar
          isTyping={isTyping}
          shouldBounce={shouldBounce}
          isFocused={isFocused}
          isSendHovered={isSendHovered}
        />
        <ChatBubbleContent
          message={message}
          copiedMessageId={copiedMessageId}
          onCopy={onCopy}
          isBot={true}
        />
      </div>
      </div>
  );
};

const ChatBubbleContent = ({ message, copiedMessageId, onCopy, isBot }) => {
  return (
    <div 
            onClick={() => onCopy(message.text, message.id)}
            className={joinClasses(
        "chat-bubble relative px-4 py-2 rounded-2xl max-w-md break-words cursor-pointer select-all",
        isBot ? "bot-bubble" : "user-bubble"
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

      <style jsx>{`
        .chat-bubble {
          position: relative;
          transform: scale(1);
          z-index: 1;
          isolation: isolate;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

        .bot-bubble {
          background: linear-gradient(135deg, #9e8ad3 0%, #3c64ff 100%);
          color: white;
          box-shadow: rgba(34, 255, 255, 0.1) 0px 4px 12px;
        }

        .user-bubble {
          background: #4a4a4a;
          color: white;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }

        .chat-bubble:active {
          transform: scale(0.98);
        }

        :global(.group:hover) .chat-bubble {
          transform: scale(1.02);
        }

        :global(.group:hover) .bot-bubble::before {
          opacity: 0.5;
          animation: pulse 2s ease-in-out infinite;
        }

        :global(.group:hover) .user-bubble {
          background: #5a5a5a;
        }

        .copy-indicator {
          transform-origin: top right;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          animation: copySuccess 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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