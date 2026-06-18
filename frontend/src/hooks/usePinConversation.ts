import { api } from "../api/client";

export function usePinConversation() {
  async function pin(conversationId: string) {
    await api.patch(`/conversations/${conversationId}/pin`);
  }

  return {
    pin,
  };
}
