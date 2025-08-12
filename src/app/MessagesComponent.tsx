"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";
import TypewriterEffect from "@/components/TypewriterEffect";

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
    <div className="flex flex-col justify-end w-full h-full overflow-y-auto  space-y-4">
      <div className="px-2  py-2 flex flex-col overflow-y-auto ">
        {/* <div className={`flex justify-start`}>
          <div className={`max-w-3xl p-4  text-md bg-[#15272A] rounded-md`}>
            <h4 className="text-[#969696] text-sm font-semibold">
              DEFAULT PERSONA
            </h4>
            <p className="text-md mt-2 font-semibold">
              World-Class React/Front-End Developer
            </p>
          </div>
        </div> */}

        <div className={`flex justify-start`}>
          <div
            className={`max-w-3xl py-4  text-md rounded-md flex flex-col gap-2 justify-start`}
          >
            <h4 className="text-[#969696] text-sm font-semibold flex items-center">
              ASK AWAY ASSISTANT <Dot /> ChadGPT 4o
            </h4>
            <p className="text-sm ">
              How can I help you today to ensure your prompts yield the best
              possible results
            </p>

            <div className="bg-[#202020] flex justify-between items-center gap-3 p-3 w-24 rounded">
              <CopyIcon size={14} /> <ArrowDownToLine size={14} />{" "}
              <Split size={14} className="rotate-90" />{" "}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-md">
            <p className="text-red-400 text-sm">
              Error:{" "}
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } gap-10  mt-6 `}
          >
            <div
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : ""
              } gap-2`}
            >
              <div
                className={`max-w-3xl text-sm  rounded-lg ${
                  message.role === "user"
                    ? "bg-[#202020] text-white p-5"
                    : " text-white "
                }`}
              >
                {message.role === "user" ? (
                  <MarkdownWrapper content={message.content} />
                ) : (
                  <TypewriterEffect
                    content={message.content}
                    isStreaming={isFetchingChatResponse && messages[messages.length - 1]?.id === message.id}
                    messageId={String(message.id)}
                    speed={15}
                  />
                )}
              </div>
              <div className="bg-[#202020] flex justify-between items-center gap-3 p-3 w-24 rounded">
                <CopyIcon size={14} /> <ArrowDownToLine size={14} />{" "}
                <Split size={14} className="rotate-90 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}

        {isFetchingChatResponse && (
          <div
            key="loading"
            className={`flex flex-col gap-4 justify-start mt-5  `}
          >
            <div className="flex items-end gap-1  my-1  h-5">
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.10s]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
            </div>

            {/* <div className="bg-[#202020] flex justify-between items-center gap-2 p-3 w-24 rounded">
              <CopyIcon size={14} /> <ArrowDownToLine size={14} />{" "}
              <Split size={14} className="rotate-90" />
            </div> */}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessagesComponent;
