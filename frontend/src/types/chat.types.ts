export interface Conversation {
  id: string;
  title: string;
  userId: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  filename: string;
  similarity: number;
  excerpt: string;
}

export interface Message {
  id: string;

  conversationId?: string;

  role: "USER" | "ASSISTANT";

  content: string;

  createdAt: string;

  citations?: Citation[];
}

export type CreateConversationResponse = Conversation;
