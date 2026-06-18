import { api } from "../api/client";

export function useDeleteConversation() {
  async function remove(conversationId: string) {
    await api.delete(`/conversations/${conversationId}`);
  }

  return {
    remove,
  };
}
