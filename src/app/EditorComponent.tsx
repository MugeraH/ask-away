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
    <div className=" ">
      <div className="flex justify-between relative border border-[#202020] px-2 py-1 w-full ">
        {/* <Editor
          initialValue={value}
          onChange={setValue}
          handleInputChange={handleInputChange}
        /> */}

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDownCapture={handleKeyPress}
          placeholder={"Ask me anything..."}
          disabled={isFetchingChatResponse}
          className="text-white font-default bg-transparent py-4 px-2 focus:outline-none w-[80%]"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-3  py-2">
          <Command size={18} />
          <div
            className="flex gap-2 cursor-pointer text-sm"
            onClick={() => {
              handleSend();
              // editor?.commands.setContent("");
            }}
          >
            <span>Send</span>

            {isFetchingChatResponse ? (
              <Loader2
                size={18}
                onClick={() => {
                  handleCancelRequest();
                }}
                className=" stroke-[#fff] animate-spin"
              />
            ) : (
              <Send size={18} />
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <div
          className="flex items-center gap-2 cursor-pointer text-sm"
          onClick={() => {
            // setOpenCommandsContainer(true);
          }}
        >
          <SquareSlash size={20} /> <span>Commands</span>
        </div>
      </div>
    </div>
  );
}

export default EditorComponent;
