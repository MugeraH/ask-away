"use server";

import { HfInference } from "@huggingface/inference";
import axios from "axios";
import * as cheerio from "cheerio";

const inference = new HfInference(process.env.HUGGING_FACE_TOKEN);

interface ChatResponse {
  fullResponse: string;
}

class ChatRequestError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ChatRequestError";
  }
}

class WebScrapeError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "WebScrapeError";
  }
}

export async function chatRequest(request: string): Promise<ChatResponse> {
  try {
    const chatResponse = await inference.chatCompletionStream({
      model: "microsoft/Phi-3-mini-4k-instruct",
      messages: [{ role: "user", content: request }],
      max_tokens: 500,
    });

    let fullResponse = "";

    for await (const chunk of chatResponse) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      fullResponse += content;
    }

    return { fullResponse };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ChatRequestError("Request aborted", error);
    }
    if (error instanceof Error) {
      throw new ChatRequestError("Chat request failed", error);
    }
    throw new ChatRequestError("An unknown error occurred during chat request");
  }
}

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Remove script and style tags
    $("script, style").remove();

    // Get the text content and remove extra whitespace
    const rawText = $("p").text().replace(/\s+/g, " ").trim();

    if (!rawText) {
      throw new WebScrapeError("No content found on the webpage");
    }

    return rawText;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new WebScrapeError(
        `Failed to fetch website: ${error.message}`,
        error
      );
    }
    if (error instanceof Error) {
      throw new WebScrapeError("Error scraping website", error);
    }
    throw new WebScrapeError("An unknown error occurred during web scraping");
  }
}
