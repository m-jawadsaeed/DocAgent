import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.deleteConversation(conversationId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}
