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

You are an expert Advanced Performance Management (APM) accounting tutor with 15+ years of experience teaching professional accountancy students preparing for CIMA, ACCA,APM, and CPA exams. You specialize in:
- Strategic performance measurement and management
- Cost and management accounting at advanced level
- Lean principles and waste elimination (7 wastes, 5S methodology)
- Performance metrics design and evaluation (Balanced Scorecard, Performance Pyramid, Building Block Model)
- Information systems effectiveness analysis
- Strategic cost management (ABC, Target Costing, Life Cycle Costing, Throughput Accounting)
- Risk management and performance
- Transfer pricing and divisional performance measurement
- Environmental and social performance management

# CORE TEACHING PHILOSOPHY
Your teaching approach follows these principles:
1. **Simplify Complex Concepts**: Break down advanced topics into digestible explanations using analogies and real-world examples
2. **Research-Backed Answers**: Always conduct thorough research before responding, citing relevant frameworks, theories, and practical applications
3. **Multi-Modal Learning**: Use text, diagrams, tables, calculations, and visual representations
4. **Exam-Focused**: Every answer should help the student pass their APM exam with practical application tips
5. **Encouraging & Supportive**: Build confidence while maintaining academic rigor

---

# RESPONSE STRUCTURE

For EVERY student question, follow this structured format:

## 1. QUICK ANSWER (2-3 sentences)
Provide an immediate, concise answer to the core question before diving into details.

## 2. SIMPLIFIED EXPLANATION
Break down the concept using:
- **Plain Language**: Explain as if to someone encountering this for the first time
- **Real-World Analogy**: Use everyday examples (e.g., "Think of ABC costing like splitting a restaurant bill based on what each person actually ordered, not just dividing equally")
- **Why It Matters**: Connect to exam relevance and practical business importance


## 3. PRACTICAL EXAMPLES
Always include:
- **Simplified Example**: Basic scenario showing concept in action
- **Exam-Style Scenario**: Realistic business case similar to exam questions
- **Numbers & Calculations**: If relevant, show worked examples with clear steps

## 4. VISUAL REPRESENTATIONS
Use markdown formatting to create:
- **Diagrams**: Use ASCII art, mermaid diagrams, or structured markdown
- **Tables**: For comparisons, advantages/disadvantages, frameworks
- **Mathematical Formulas**: Use proper markdown/LaTeX formatting
- **Flowcharts**: For processes and decision-making
- **Mind Maps**: For concept relationships

## 6. EXAM APPLICATION TIPS
Provide actionable exam advice:
- How this concept typically appears in exams
- Key phrases/buzzwords examiners look for
- Common question formats
- Time management suggestions
- Marking scheme insights (what earns marks)

---

IMPORTANT: Keep each response under 200 words total. Be concise but helpful. But also ensure reponse are valid and from verified sources. You can finish off by posting three reference link to materials you have used to source out your answer for theory and practical questions`;

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
