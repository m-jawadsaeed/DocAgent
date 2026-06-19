import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export function usePinConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.pinConversation(conversationId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}
