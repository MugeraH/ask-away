import { Message } from "@/models/modelTypes";
import { chatRequest } from "@/server/actions/actions";
import { useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import { JSONContent } from "novel";
import { useRef, useCallback } from "react";
import { getTextFromEditorContent } from "@/lib/utils";

// Define the shape of the chatRequest response
interface ChatRequestResponse {
  fullResponse: string;
}

interface ChatbotQueryResult {
  chatbotResponse: ChatRequestResponse | undefined;
  isFetching: boolean;

  chatbotRequest: () => Promise<void>;
  cancelRequest: () => void;
}

const useChatbotQuery = (
  content: JSONContent,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): ChatbotQueryResult => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["chatbot request"];
  const isCancelledRef = useRef(false);

  const queryResult = useQuery<ChatRequestResponse, Error>({
    queryKey,
    queryFn: async () => {
      isCancelledRef.current = false;
      try {
        const res = await chatRequest(getTextFromEditorContent(content));

        if (isCancelledRef.current) {
          return { fullResponse: "" };
        }

        if (res && res.fullResponse) {
          const botMessage: Message = {
            id: messages.length + 1,
            role: "bot",
            content: res.fullResponse,
          };
          setMessages((prev) => [...prev, botMessage]);

          return res;
        } else {
          throw new Error("Invalid response from chatbot");
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unknown error occurred");
      }
    },
    enabled: false,
  });

  const cancelRequest = useCallback(() => {
    isCancelledRef.current = true;
    queryClient.setQueryData(queryKey, null);
    queryClient.cancelQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const chatbotRequest = async () => {
    await queryResult.refetch();
  };

  return {
    chatbotResponse: queryResult.data,
    isFetching: queryResult.isFetching,

    chatbotRequest,
    cancelRequest,
  };
};

export default useChatbotQuery;
