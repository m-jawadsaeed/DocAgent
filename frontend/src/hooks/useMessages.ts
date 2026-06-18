import { useQuery } from "@tanstack/react-query";

import { chatService } from "../services/chat.service";

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],

    queryFn: () => chatService.getMessages(conversationId),

    enabled: conversationId.length > 0,
  });
}
