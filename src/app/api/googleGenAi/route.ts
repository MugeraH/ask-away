// UPDATED IMPLEMENTATION - Using latest @google/genai SDK
import { GoogleGenAI } from "@google/genai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export async function POST(req: Request) {
  try {
    // Validate environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Parse and validate request body
    const reqBody: RequestBody = await req.json();
    
    if (!reqBody.messages || !Array.isArray(reqBody.messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request format: messages array required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const messages: Message[] = reqBody.messages;

    // Initialize the new Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Use the latest model - gemini-2.5-flash for better performance
    const modelName = "gemini-2.5-flash";

    // Convert messages to the new format
    const contents = buildGeminiContents(messages);

    // Generate streaming response using the new API
    const response = await ai.models.generateContentStream({
      model: modelName,
      contents: contents,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

function buildGeminiContents(messages: Message[]) {
  return messages
    .filter(message => message.role === "user" || message.role === "assistant")
    .map(message => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }));
}

// OLD IMPLEMENTATION - COMMENTED OUT
// import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";
// import { GoogleGenerativeAI } from "@google/generative-ai";
//
// export async function POST(req: Request) {
//   const reqBody = await req.json();
//
//   const messages: Message[] = reqBody.messages;
//   // if imageparts exist then take the last user message as prompt
//   const modelName = "gemini-pro";
//   const promptWithParts = buildGoogleGenAIPrompt(messages);
//
//   const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
//
//   const model = genAI.getGenerativeModel({
//     model: modelName,
//   });
//
//   const streamingResponse = await model.generateContentStream(promptWithParts);
//   return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
// }
//
// function buildGoogleGenAIPrompt(messages: Message[]) {
//   return {
//     contents: messages
//       .filter(
//         (message) => message.role === "user" || message.role === "assistant"
//       )
//       .map((message) => ({
//         role: message.role === "user" ? "user" : "model",
//         parts: [{ text: message.content }],
//       })),
//   };
// }




