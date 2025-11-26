"use client";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";
import EditorComponent from "./EditorComponent";
import MessagesComponent from "./MessagesComponent";
import { useEditor } from "novel";

import { useChat } from "ai/react";

function Home() {
  const editor = useEditor();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
  } = useChat({
    api: "api/googleGenAi",
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Use modern key property instead of deprecated keyCode
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  React.useEffect(scrollToBottom, [messages]);

  return (
    <div className="w-full min-h-screen relative">
      <Topbar />

      <div className="mt-2 h-full w-[90%] mx-auto py-3">
        {/* Error display */}

        <div className="w-full max-h-[calc(100vh-15rem)] h-[calc(100vh-15rem)] bg-pink-400">
          <MessagesComponent
            messages={messages}
            messagesEndRef={messagesEndRef}
            isFetchingChatResponse={isLoading}
            editor={editor}
            error={error || null}
          />
        </div>

        <div className="flex flex-col mt-6 z-[100] w-[90%] absolute bottom-5 ">
          <EditorComponent
            value={input}
            isFetchingChatResponse={isLoading}
            handleSend={handleSubmit}
            handleCancelRequest={stop}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
}

const Topbar = () => {
  return (
    <div className="w-full py-[14px] px-4 flex justify-between items-center border-b border-[#202020]">
      <h4 className="text-md font-semibold">Model Search</h4>
      <div className="hidden md:block ">
        {/* <Tabs defaultValue="sequential" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="parallel">Parallel</TabsTrigger>
            <TabsTrigger value="sequential">Sequential</TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      <div className="flex items-center gap-3 ">
        <Menubar className="border-none w-[150px] p-0">
          <MenubarMenu>
            <MenubarTrigger className="text-sm w-full justify-between py-3.5 px-2.5">
              Gemini 2.5
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="white"
                className="h-4 w-4   "
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </MenubarTrigger>
            {/* <MenubarContent className="border-none w-[250px]">
              <MenubarItem>Model one</MenubarItem>
              <MenubarItem>Model two</MenubarItem>
            </MenubarContent> */}
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Home;
