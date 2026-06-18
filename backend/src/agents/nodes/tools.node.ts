import { ToolNode } from "@langchain/langgraph/prebuilt";

import { documentSearchTool } from "../../tools/document-search.tool.js";
import { summarizeDocumentTool } from "../../tools/summarizeDocument.tool.js";
import { getConversationHistoryTool } from "../../tools/getConversationHistory.tool.js";
import { getConversationMemoryTool } from "../../tools/getConversationMemory.tool.js";
import { listUserDocumentsTool } from "../../tools/listUserDocuments.tool.js";

export const toolsNode = new ToolNode([
  documentSearchTool,
  summarizeDocumentTool,
  getConversationHistoryTool,
  getConversationMemoryTool,
  listUserDocumentsTool,
]);
