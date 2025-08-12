import React, { useState, useEffect, useRef } from 'react';
import MarkdownWrapper from './MarkdownWrapper';

interface TypewriterEffectProps {
  content: string;
  isStreaming: boolean;
  messageId: string;
  speed?: number; // milliseconds between characters
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  content,
  isStreaming,
  messageId,
  speed = 15
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const previousContentRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If content is the same as before, don't restart animation
    if (content === previousContentRef.current) {
      return;
    }

    // If not streaming or content is shorter (shouldn't happen), show immediately
    if (!isStreaming || content.length < previousContentRef.current.length) {
      setDisplayedContent(content);
      setIsTyping(false);
      previousContentRef.current = content;
      return;
    }

    // Start typing animation for new content
    const newContent = content.slice(previousContentRef.current.length);
    if (newContent.length > 0) {
      setIsTyping(true);
      
      let currentIndex = previousContentRef.current.length;
      const typeNextChar = () => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutRef.current = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
          previousContentRef.current = content;
        }
      };

      // Start typing with a small delay
      timeoutRef.current = setTimeout(typeNextChar, speed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, isStreaming, speed]);

  // Reset when message ID changes (new message)
  useEffect(() => {
    setDisplayedContent('');
    setIsTyping(false);
    previousContentRef.current = '';
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [messageId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <MarkdownWrapper content={displayedContent} />
      {(isStreaming || isTyping) && (
        <span className="inline-block w-0.5 h-4 bg-white animate-pulse ml-1 align-middle" />
      )}
    </div>
  );
};

export default TypewriterEffect;
