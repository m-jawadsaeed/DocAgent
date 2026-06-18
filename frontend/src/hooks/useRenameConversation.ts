import { api } from "../api/client";

export function useRenameConversation() {
  async function rename(conversationId: string, title: string) {
    await api.patch(`/conversations/${conversationId}`, {
      title,
    });
  }

  return {
    rename,
  };
}
