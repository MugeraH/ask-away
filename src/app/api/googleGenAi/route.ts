import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export async function POST(req: Request) {
  const reqBody = await req.json();

  const messages: Message[] = reqBody.messages;
  // if imageparts exist then take the last user message as prompt
  const modelName = "gemini-pro";
  const promptWithParts = buildGoogleGenAIPrompt(messages);

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const streamingResponse = await model.generateContentStream(promptWithParts);
  return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}

function buildGoogleGenAIPrompt(messages: Message[]) {
  return {
    contents: messages
      .filter(
        (message) => message.role === "user" || message.role === "assistant"
      )
      .map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      })),
  };
}
