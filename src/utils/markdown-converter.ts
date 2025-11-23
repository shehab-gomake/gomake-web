/**
 * Markdown Converter Utility
 *
 * Converts HTML to Markdown format compatible with Chatwoot's message storage.
 * Uses Turndown library to convert rich text editor HTML to Markdown.
 */

import TurndownService from "turndown";

/**
 * Create and configure Turndown service with Chatwoot-compatible rules
 */
function createMarkdownConverter(): TurndownService {
  const turndownService = new TurndownService({
    // Convert <br> to newlines
    br: "\n",
    // Use * for bold and italic (Chatwoot standard)
    emDelimiter: "*",
    strongDelimiter: "**",
    // Use - for bullet lists
    bulletListMarker: "-",
    // Preserve code blocks
    codeBlockStyle: "fenced",
    // Use ``` for code fences
    fence: "```",
    // Link style
    linkStyle: "inlined",
    // Heading style
    headingStyle: "atx",
  });

  // Custom rule: Remove empty paragraphs
  turndownService.addRule("removeEmptyParagraphs", {
    filter: (node) => {
      return (
        node.nodeName === "P" &&
        !node.textContent?.trim() &&
        !node.querySelector("img")
      );
    },
    replacement: () => "",
  });

  // Custom rule: Handle line breaks better
  turndownService.addRule("lineBreaks", {
    filter: ["br"],
    replacement: () => "  \n", // Two spaces + newline = Markdown line break
  });

  return turndownService;
}

// Create singleton instance
const markdownConverter = createMarkdownConverter();

/**
 * Convert HTML to Markdown
 * @param html - HTML string from rich text editor
 * @returns Markdown string compatible with Chatwoot
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "" || html === "<p></p>") {
    return "";
  }

  try {
    const markdown = markdownConverter.turndown(html);
    // Clean up excessive newlines (more than 2 consecutive)
    return markdown.replace(/\n{3,}/g, "\n\n").trim();
  } catch (error) {
    console.error("[markdown-converter] Failed to convert HTML to Markdown:", error);
    // Fallback: strip HTML tags and return plain text
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
}

/**
 * Check if HTML content is empty (only contains empty paragraph tags)
 * @param html - HTML string to check
 * @returns true if empty, false otherwise
 */
export function isEmptyHtml(html: string): boolean {
  if (!html || html.trim() === "") {
    return true;
  }

  // Convert to markdown and check if empty
  const markdown = htmlToMarkdown(html);
  return markdown.trim() === "";
}
