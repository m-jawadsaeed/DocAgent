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

  public async renameConversation(id: string, title: string): Promise<void> {
    await api.patch(`/conversations/${id}`, {
      title,
    });
  }

  public async deleteConversation(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`);
  }

  public async createConversation(): Promise<Conversation> {
    const response = await api.post<Conversation>("/conversations");

    return response.data;
  }
}

export const chatService = new ChatService();
