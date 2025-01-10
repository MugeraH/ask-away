import { clsx, type ClassValue } from "clsx";
import { JSONContent } from "novel";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTextFromEditorContent = (content: JSONContent) => {
  if (!content?.content?.length) return "";

  return content.content
    .map((block) => {
      if (block.type === "paragraph" && block.content) {
        return block.content.map((item) => item.text || "").join("");
      }
      return "";
    })
    .join("\n")
    .trim();
};
