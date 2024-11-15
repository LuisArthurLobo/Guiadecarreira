import React from 'react';
import { ClipboardCheck, ClipboardCopy } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant, className }) => (
  <div className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full 
    ${variant === 'outline' ? 'border border-gray-500' : ''} 
    ${className}`}
  >
    {children}
  </div>
);

interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
  isHtml?: boolean;
  isMarkdown?: boolean;
}

interface ChatBubbleProps {
  message: Message;
  type: 'user' | 'bot';
  userInitials?: string;
  isTyping?: boolean;
  shouldBounce?: boolean;
  isFocused?: boolean;
  isSendHovered?: boolean;
  copiedMessageId: string | null;
  onCopy: (text: string, messageId: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  type,
  userInitials,
  isTyping,
  copiedMessageId,
  onCopy
}) => {
  const isUser = type === 'user';
  const isCopied = copiedMessageId === message.id;
  
  const renderContent = () => {
    if (message.isHtml) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: message.text as string }}
          className="prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 prose-pre:my-1"
        />
      );
    }
    return message.text;
  };

  const copyContent = () => {
    const text = typeof message.text === 'string' 
      ? message.text 
      : message.isHtml 
        ? (message.text as { props: { dangerouslySetInnerHTML: { __html: string } } }).props.dangerouslySetInnerHTML.__html
        : '';
    onCopy(text, message.id);
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4a4a4a] flex items-center justify-center">
          <Badge variant="outline" className="text-xs font-medium">AI</Badge>
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4a4a4a] flex items-center justify-center">
          <span className="text-xs font-medium">{userInitials}</span>
        </div>
      )}
      
      <div 
        className={`group relative max-w-[80%] rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-[#4a4a4a] text-white'
            : 'bg-[#2e2e2e] text-white'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-grow break-words">{renderContent()}</div>
          
          <button
            onClick={copyContent}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[#5a5a5a] rounded ${
              isCopied ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            {isCopied ? <ClipboardCheck size={16} /> : <ClipboardCopy size={16} />}
          </button>
        </div>
        
        {isTyping && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1">
            <span className="animate-bounce delay-100">•</span>
            <span className="animate-bounce delay-200">•</span>
            <span className="animate-bounce delay-300">•</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;