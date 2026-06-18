export interface ToolContext {
  userId: string;
  conversationId: string;
}

let currentContext: ToolContext | null = null;

export function setToolContext(context: ToolContext) {
  currentContext = context;
}

export function getToolContext() {
  if (!currentContext) {
    throw new Error("Tool context not initialized");
  }

  return currentContext;
}
