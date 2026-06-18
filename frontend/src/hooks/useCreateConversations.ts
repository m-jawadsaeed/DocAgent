import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatService } from "../services/chat.service";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatService.createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}
