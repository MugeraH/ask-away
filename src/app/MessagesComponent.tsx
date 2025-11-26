"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";

import { Message } from "@/models/modelTypes";
import { EditorContextValue } from "@tiptap/react";

import { CopyIcon, ArrowDownToLine, Split, Dot } from "lucide-react";

type Props = {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setContent?: React.Dispatch<React.SetStateAction<string>>;
  editor: EditorContextValue | null;
  isFetchingChatResponse: boolean;
  error: Error | null;
};
function MessagesComponent({
  messages,
  messagesEndRef,
  error,

  isFetchingChatResponse,
}: Props) {
  return (
    <div className="flex flex-col justify-end w-full h-full overflow-y-auto bg-app-primary">
      <div className="px-6 py-8 flex flex-col overflow-y-auto space-y-10">
        {/* Welcome Message */}
        <div className="flex justify-start">
          <div className="max-w-4xl py-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-app-accent rounded-full flex items-center justify-center">
                <Dot size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-app-secondary text-sm font-medium flex items-center gap-2">
                  ASK AWAY ASSISTANT
                  <span className="px-2 py-1 bg-app-elevated text-app-accent text-xs rounded-app-sm font-semibold">
                    APM Tutor
                  </span>
                </h4>
                <p className="text-app-muted text-xs mt-1">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-app-secondary font-light">
              I'm your expert APM accounting tutor. Ask me anything about
              Advanced Performance Management, and I'll provide structured,
              concise answers to help you excel in your studies.
            </p>

            <div className="bg-app-tertiary hover:bg-app-elevated transition-all duration-200 flex justify-between items-center gap-3 p-3 rounded-app-lg border border-app-primary shadow-app-sm mt-4">
              <CopyIcon
                size={16}
                className="text-app-muted hover:text-app-accent cursor-pointer transition-colors"
              />
              <ArrowDownToLine
                size={16}
                className="text-app-muted hover:text-app-accent cursor-pointer transition-colors"
              />
              <Split
                size={16}
                className="rotate-90 text-app-muted hover:text-app-accent cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-auto max-w-4xl p-4 bg-red-500/10 border border-red-500/20 rounded-app-lg backdrop-blur-sm shadow-app-md">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              <p className="text-red-300 text-sm leading-relaxed">
                <span className="font-medium">Error:</span>{" "}
                {error.message || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        )}

        {messages
          .filter((message) => {
            // Show all user messages and completed assistant messages
            if (message.role === "user") return true;
            // Hide the currently loading assistant message
            return (
              !isFetchingChatResponse ||
              messages[messages.length - 1]?.id !== message.id
            );
          })
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                } gap-5 max-w-4xl w-full`}
              >
                <div
                  className={`text-base leading-relaxed rounded-app-xl shadow-app-md ${
                    message.role === "user"
                      ? "bg-app-accent border border-blue-500/20 text-white px-6 py-5 ml-12"
                      : "bg-app-tertiary border border-app-primary text-app-primary px-8 py-6 mr-12 space-y-4"
                  }`}
                >
                  <MarkdownWrapper content={message.content} />
                </div>
              </div>
            </div>
          ))}

        {isFetchingChatResponse && (
          <div
            key="loading"
            className="flex justify-start w-full animate-in fade-in duration-300"
          >
            <div className="flex flex-col gap-5 max-w-4xl w-full mr-12">
              <div className="bg-app-tertiary border border-app-primary rounded-app-xl px-8 py-6 shadow-app-md animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 h-6">
                    <div className="h-3 w-3 bg-app-accent rounded-full animate-pulse [animation-delay:-0.4s] [animation-duration:1.5s]"></div>
                    <div className="h-3 w-3 bg-app-accent/80 rounded-full animate-pulse [animation-delay:-0.2s] [animation-duration:1.5s]"></div>
                    <div className="h-3 w-3 bg-app-accent/60 rounded-full animate-pulse [animation-delay:0s] [animation-duration:1.5s]"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-app-secondary text-sm font-medium animate-pulse">
                      APM Tutor is analyzing your question...
                    </span>
                    <div className="flex gap-1">
                      <div className="h-1 w-8 bg-app-accent/30 rounded-full animate-pulse [animation-delay:-0.1s]"></div>
                      <div className="h-1 w-12 bg-app-accent/20 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-6 bg-app-accent/10 rounded-full animate-pulse [animation-delay:-0.5s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessagesComponent;
