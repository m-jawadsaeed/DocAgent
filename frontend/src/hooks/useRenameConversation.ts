import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export function useRenameConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      title,
    }: {
      conversationId: string;
      title: string;
    }) => chatService.renameConversation(conversationId, title),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}
