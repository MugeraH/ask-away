"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";
import { processChunkedContent } from "@/utils/processChunkedContent";

import { Message } from "@/models/modelTypes";
import { EditorContextValue } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Dot } from "lucide-react";

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
  const [loadingMessage, setLoadingMessage] = useState("");

  const loadingMessages = [
    "Great question! Unlike your last exam grade, this one's going places! 📈",
    "Your brain cells are working harder than a CFO during audit season! 🧠",
    "At least someone's asking the right questions... unlike management! 🤔",
    "This question is more balanced than most company budgets! ⚖️",
    "You're building APM skills faster than companies build debt! 💪",
    "Your curiosity > Your procrastination (finally!) 🎯",
    "Plot twist: You're actually learning something today! 📚",
    "This question won't haunt you like variance analysis nightmares! 👻",
    "Congrats! You've asked a question that won't make your tutor cry! 🎉",
    "Your APM knowledge is growing... unlike your sleep schedule! 😴",
  ];

  // Set random message when loading starts
  useEffect(() => {
    if (isFetchingChatResponse && !loadingMessage) {
      const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setLoadingMessage(randomMessage);
    } else if (!isFetchingChatResponse) {
      setLoadingMessage("");
    }
  }, [isFetchingChatResponse]);
  return (
    <div className="flex flex-col justify-end w-full h-full overflow-y-auto bg-app-primary">
      <div className="px-6 py-8 flex flex-col overflow-y-auto space-y-10">
        {/* Welcome Message */}
        <div className="flex justify-start">
          <div className="max-w-5xl py-8 flex flex-col gap-4">
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
              I&apos;m your expert APM accounting tutor. Ask me anything about
              Advanced Performance Management, and I&apos;ll provide structured,
              concise answers to help you excel in your studies.
            </p>
            {/* 
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
            </div> */}
          </div>
        </div>

        {error && (
          <div className="mx-auto max-w-5xl p-4 bg-red-500/10 border border-red-500/20 rounded-app-lg backdrop-blur-sm shadow-app-md">
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
          .map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                } gap-5 max-w-5xl w-full`}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                  className={`text-base leading-relaxed rounded-app-xl shadow-app-md transition-all duration-200 hover:shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500/30 text-white px-6 py-5 ml-12 shadow-blue-500/20"
                      : "bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 text-slate-800 px-8 py-6 mr-12 space-y-4 shadow-slate-200/40"
                  }`}
                >
                  <MarkdownWrapper content={processChunkedContent(message.content)} />
                </motion.div>
              </div>
            </motion.div>
          ))}

        <AnimatePresence>
          {isFetchingChatResponse && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex justify-start w-full"
            >
              <div className="flex flex-col gap-5 max-w-5xl w-full mr-12">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-app-xl px-8 py-6 shadow-lg shadow-slate-200/40 w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 h-6">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="h-3 w-3 bg-blue-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="h-3 w-3 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="h-3 w-3 bg-blue-300 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between flex-wrap gap-1 items-center w-full">
                      <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-slate-700 text-sm pt-1 font-medium"
                      >
                        Analyzing your question...
                      </motion.span>
                      <div className="text-center">
                        <p className="text-slate-500 text-sm italic">
                          {loadingMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessagesComponent;
