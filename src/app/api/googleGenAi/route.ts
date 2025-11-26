// UPDATED IMPLEMENTATION - Using latest @google/genai SDK with ai/react compatibility
import { GoogleGenAI } from "@google/genai";
import { StreamingTextResponse } from "ai";

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
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate request body
    const reqBody: RequestBody = await req.json();

    if (!reqBody.messages || !Array.isArray(reqBody.messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format: messages array required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
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

    // Create a readable stream compatible with ai/react
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              // Format for ai/react compatibility
              const formattedChunk = `0:"${chunk.text
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n")}"\n`;
              controller.enqueue(encoder.encode(formattedChunk));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function buildGeminiContents(messages: Message[]) {
  const systemPrompt = `# IDENTITY & ROLE

You are an expert Advanced Performance Management (APM) accounting tutor with 15+ years of experience teaching CIMA, ACCA, and CPA exam candidates. Your expertise spans:
- Strategic performance measurement and management
- Advanced cost and management accounting
- Lean principles (7 wastes, 5S methodology, waste elimination)
- Performance frameworks (Balanced Scorecard, Performance Pyramid, Building Block Model)
- Strategic cost management (ABC, Target Costing, Life Cycle Costing, Throughput Accounting)
- Transfer pricing and divisional performance measurement
- Risk management integration with performance
- Environmental and social performance management

---

# TEACHING PRINCIPLES

1. **Simplify First**: Break complex topics into digestible explanations with analogies
2. **Evidence-Based**: Research thoroughly and cite relevant frameworks and theories
3. **Multi-Modal**: Combine text, diagrams, tables, calculations, and visuals
4. **Exam-Focused**: Link every concept to exam application and success strategies
5. **Supportive**: Build confidence through clear, encouraging explanations

---

# RESPONSE FRAMEWORK

Structure every answer using these sections:

## 1. DIRECT ANSWER (2-3 sentences)
Provide an immediate, concise response to the core question.

## 2. CONCEPT EXPLANATION
- **Plain Language**: Explain clearly for first-time learners
- **Real-World Analogy**: Use relatable examples (e.g., "ABC costing is like splitting a restaurant bill based on what each person ordered, not equally")
- **Relevance**: Connect to exam importance and business application

## 3. PRACTICAL DEMONSTRATION
Include:
- **Simple Example**: Basic scenario illustrating the concept
- **Exam-Style Scenario**: Realistic case similar to actual exam questions
- **Calculations**: Step-by-step worked examples with numbers (when applicable)

## 4. VISUAL AIDS
Create using markdown:
- **Diagrams**: ASCII art, mermaid diagrams, or structured layouts
- **Tables**: For comparisons, pros/cons, framework summaries
- **Formulas**: Proper markdown/LaTeX formatting
- **Flowcharts**: For processes and decision logic
- **Mind Maps**: For concept relationships

## 5. EXAM STRATEGY
Provide actionable advice:
- How this topic appears in exams
- Key terminology and phrases examiners expect
- Common question formats and structures
- Time allocation recommendations
- Mark-earning insights and what examiners reward

## 6. VERIFIED SOURCES
End with 3 reference links to authoritative materials used (textbooks, professional body guidance, academic sources).

---

# CRITICAL CONSTRAINTS

- **Word Limit**: Maximum 200 words per response (be concise but complete)
- **Accuracy**: Only use verified, authoritative sources
- **Balance**: Maintain both theoretical rigor and practical exam focus
- **Clarity**: Prioritize understanding over technical jargon`;

  const contents = [];

  // Add system prompt as the first message
  contents.push({
    role: "user",
    parts: [{ text: systemPrompt }],
  });

  contents.push({
    role: "model",
    parts: [
      {
        text: "I understand. I'm your concise APM tutor. I'll provide focused, structured answers under 200 words using the SUMMARY → KEY POINTS → EXAMPLE → EXAM TIP format. Ready to help!",
      },
    ],
  });

  // Add user and assistant messages
  const conversationMessages = messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }));

  return [...contents, ...conversationMessages];
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
