import React, { useState, useEffect, useRef } from 'react';

interface EmojiAvatarProps {
  isTyping?: boolean;
  shouldBounce?: boolean;
  isFocused?: boolean;
  isSendHovered?: boolean;
}

const EmojiAvatar: React.FC<EmojiAvatarProps> = ({
  isTyping = false,
  shouldBounce = false,
  isFocused = false,
  isSendHovered = false
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [watchingPosition, setWatchingPosition] = useState(0);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startBlinkInterval = () => {
      blinkIntervalRef.current = setInterval(() => {
        const shouldBlink = Math.random() < 0.3;
        if (shouldBlink && !isTyping) {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }
      }, 2000);
    };

    startBlinkInterval();

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [isTyping]);

  useEffect(() => {
    if (isFocused) {
      setWatchingPosition(1);
    } else {
      setWatchingPosition(0);
    }
  }, [isFocused]);

  const getEyeTransform = () => {
    return `translate(${watchingPosition * 2}px, 0)`;
  };

  return (
    <div className="h-10 w-10 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className={`
          text-yellow-400 transition-all duration-200
          ${shouldBounce ? 'animate-bounce' : ''}
          ${isTyping ? 'scale-110' : ''}
        `}
      >
        {/* Face */}
        <circle cx="12" cy="12" r="10" fill="currentColor" />

        {isTyping ? (
          <>
            {/* Animated typing eyes */}
            <g className="transition-transform duration-500" style={{ transform: getEyeTransform() }}>
              <circle cx="8.5" cy="10" r="2" fill="white" />
              <circle cx="8.5" cy="10" r="1" fill="black">
                <animate
                  attributeName="cy"
                  values="10;9;10;11;10"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            <g className="transition-transform duration-500" style={{ transform: getEyeTransform() }}>
              <circle cx="15.5" cy="10" r="2" fill="white" />
              <circle cx="15.5" cy="10" r="1" fill="black">
                <animate
                  attributeName="cy"
                  values="10;9;10;11;10"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Animated mouth */}
            <path
              d="M8 13C8 13 10 16 12 16C14 16 16 13 16 13"
              stroke="black"
              strokeWidth="1.5"
              fill="none"
            >
              <animate
                attributeName="d"
                dur="1s"
                repeatCount="indefinite"
                values="
                  M8 13C8 13 10 16 12 16C14 16 16 13 16 13;
                  M8 14C8 14 10 13 12 13C14 13 16 14 16 14;
                  M8 13C8 13 10 16 12 16C14 16 16 13 16 13
                "
              />
            </path>
          </>
        ) : (
          <>
            {/* Regular eyes with watching behavior */}
            <g className="transition-transform duration-500" style={{ transform: getEyeTransform() }}>
              <circle cx="8.5" cy="10" r="2" fill="white" />
              {!isBlinking && (
                <circle cx="8.5" cy="10" r="1" fill="black" />
              )}
              {isBlinking && (
                <path d="M7 10C7 10 8 10 10 10" stroke="black" strokeWidth="1.5" />
              )}
            </g>

            <g className="transition-transform duration-500" style={{ transform: getEyeTransform() }}>
              <circle cx="15.5" cy="10" r="2" fill="white" />
              {!isBlinking && (
                <circle cx="15.5" cy="10" r="1" fill="black" />
              )}
              {isBlinking && (
                <path d="M14 10C14 10 15 10 17 10" stroke="black" strokeWidth="1.5" />
              )}
            </g>

            {/* Regular smile */}
            <path
              d={isSendHovered
                ? "M8 13C8 13 10 17 12 17C14 17 16 13 16 13" // Biggest smile when send is hovered
                : isFocused
                ? "M8 13.5C8 13.5 10 15.5 12 15.5C14 15.5 16 13.5 16 13.5" // Medium smile when focused
                : "M8 13C8 13 10 15 12 15C14 15 16 13 16 13" // Regular smile
              }
              stroke="black"
              strokeWidth="1.5"
              fill="none"
              className="transition-all duration-300"
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default EmojiAvatar;