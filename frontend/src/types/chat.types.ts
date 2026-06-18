export interface Conversation {
  id: string;
  title: string;
  userId: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export type CreateConversationResponse = Conversation;
