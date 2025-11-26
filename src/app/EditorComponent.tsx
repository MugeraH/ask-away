"use client";
import React from "react";

// import Editor from "@/components/Editor/AdvancedEditor";
import { Command, Send, SquareSlash, Loader2 } from "lucide-react";

type Props = {
  value: string;

  isFetchingChatResponse: boolean;
  handleSend: () => void;
  handleCancelRequest: () => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
};
function EditorComponent({
  value,
  handleCancelRequest,
  handleSend,
  isFetchingChatResponse,
  handleInputChange,
  handleKeyPress,
}: Props) {
  return (
    <div className="p-4 my-4">
      <div className="relative bg-app-tertiary border border-app-primary rounded-app-lg shadow-app-md overflow-hidden">
        <textarea
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          disabled={isFetchingChatResponse}
          rows={3}
          className="w-full text-app-primary bg-transparent py-4 px-4 pr-24 focus:outline-none resize-none overflow-y-auto min-h-[80px] max-h-[160px] placeholder:text-app-muted transition-all duration-200"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-app-muted">
            <Command size={16} className="opacity-60" />
            <span className="text-xs">Enter</span>
          </div>

          <button
            onClick={() => {
              if (!isFetchingChatResponse) {
                handleSend();
              } else {
                handleCancelRequest();
              }
            }}
            disabled={!value.trim() && !isFetchingChatResponse}
            className="flex items-center gap-2 px-3 py-2 bg-app-accent hover:bg-blue-600 disabled:bg-app-elevated disabled:text-app-muted text-white rounded-app-md transition-all duration-200 text-sm font-medium shadow-app-sm"
          >
            {isFetchingChatResponse ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* <div className="mt-3 flex gap-2">
        <div
          className="flex items-center gap-2 cursor-pointer text-app-muted hover:text-app-secondary transition-colors"
          onClick={() => {
            // setOpenCommandsContainer(true);
          }}
        >
          <SquareSlash size={18} />
          <span className="text-sm">Commands</span>
        </div>
      </div> */}
    </div>
  );
}

export default EditorComponent;
