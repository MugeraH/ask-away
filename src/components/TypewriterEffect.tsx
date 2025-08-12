import React from 'react';
import MarkdownWrapper from './MarkdownWrapper';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isStreaming
}) => {
  return (
    <div className="relative">
      <MarkdownWrapper content={content} />
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-white animate-pulse ml-1 align-middle" />
      )}
    </div>
  );
};

export default StreamingMessage;
