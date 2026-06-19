import { api } from "../api/client";

import type { Conversation, Message } from "../types/chat.types";

export class ChatService {
  public async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>("/conversations");

    return response.data;
  }

  public async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(
      `/conversations/${conversationId}/messages`,
    );

    return response.data;
  }

  async renameConversation(conversationId: string, title: string) {
    const response = await api.patch(`/conversations/${conversationId}`, {
      title,
    });

    return response.data;
  }

  async pinConversation(conversationId: string) {
    const response = await api.patch(`/conversations/${conversationId}/pin`);

    return response.data;
  }

  async deleteConversation(conversationId: string) {
    const response = await api.delete(`/conversations/${conversationId}`);

    return response.data;
  }

  public async createConversation(): Promise<Conversation> {
    const response = await api.post<Conversation>("/conversations");

    return response.data;
  }
}

export const chatService = new ChatService();
