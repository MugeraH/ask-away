/**
 * Processes chunked content from streaming responses and converts it to a single string
 * Handles the format: 0:"content chunk 1"\n0:"content chunk 2"\n...
 */
export function processChunkedContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Check if content is in chunked format (starts with number and colon)
  const isChunkedFormat = /^\d+:"/.test(content.trim());
  
  if (!isChunkedFormat) {
    // Content is already in normal format, return as is
    return content;
  }

  // Extract content from chunked format
  const chunks = content.split('\n').filter(line => line.trim());
  let processedContent = '';

  for (const chunk of chunks) {
    // Match pattern: number:"content"
    const match = chunk.match(/^\d+:"(.*)"$/);
    if (match) {
      // Unescape the content
      const unescapedContent = match[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\\\/g, '\\');
      
      processedContent += unescapedContent;
    }
  }

  return processedContent;
}
