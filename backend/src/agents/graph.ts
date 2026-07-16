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
import { summarizeLatestDocumentTool } from "../tools/summarize_latest_document.js";

const tools = [
  documentSearchTool,
  summarizeDocumentTool,
  summarizeLatestDocumentTool,
  listUserDocumentsTool,
  getConversationHistoryTool,
  getConversationMemoryTool,
];

const toolNode = new ToolNode(tools);

async function chatNode(state: typeof MessagesAnnotation.State) {
  try {
    const response = await llmWithTools.invoke([
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...state.messages,
    ]);

    // Empty response guard
    const content =
      typeof response.content === "string" ? response.content.trim() : "";

    if (
      !content &&
      (!response.tool_calls || response.tool_calls.length === 0)
    ) {
      return {
        messages: [
          new AIMessage({
            content: "I couldn't generate a response. Please try again.",
          }),
        ],
      };
    }

    return {
      messages: [response],
    };
  } catch (error) {
    console.error("Chat node error:", error);
    throw error;
  }
}

function shouldContinue(
  state: typeof MessagesAnnotation.State,
): "tools" | typeof END {
  const lastMessage = state.messages[state.messages.length - 1];

  if (
    console.log(helo)
    "tool_calls" in lastMessage &&
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
