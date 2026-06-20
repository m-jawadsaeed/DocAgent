import { AIMessage } from "@langchain/core/messages";

import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";

import { ToolNode } from "@langchain/langgraph/prebuilt";

import { llmWithTools, SYSTEM_PROMPT } from "../services/llm.service.js";

import { documentSearchTool } from "../tools/document-search.tool.js";
import { summarizeDocumentTool } from "../tools/summarizeDocument.tool.js";
import { listUserDocumentsTool } from "../tools/listUserDocuments.tool.js";
import { getConversationHistoryTool } from "../tools/getConversationHistory.tool.js";
import { getConversationMemoryTool } from "../tools/getConversationMemory.tool.js";

const tools = [
  documentSearchTool,
  summarizeDocumentTool,
  listUserDocumentsTool,
  getConversationHistoryTool,
  getConversationMemoryTool,
];

const toolNode = new ToolNode(tools);

async function chatNode(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
}

function shouldContinue(
  state: typeof MessagesAnnotation.State,
): "tools" | typeof END {
  const lastMessage = state.messages[state.messages.length - 1];

  if (
    lastMessage instanceof AIMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0
  ) {
    return "tools";
  }

  return END;
}

export function buildGraph() {
  return new StateGraph(MessagesAnnotation)
    .addNode("chat", chatNode)
    .addNode("tools", toolNode)
    .addEdge(START, "chat")
    .addConditionalEdges("chat", shouldContinue)
    .addEdge("tools", "chat")
    .compile();
}
