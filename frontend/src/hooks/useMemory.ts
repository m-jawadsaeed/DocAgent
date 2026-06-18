import { useQuery } from "@tanstack/react-query";

import { api } from "../api/client";

export function useMemory(conversationId: string) {
  return useQuery({
    queryKey: ["memory", conversationId],

    enabled: !!conversationId,

    queryFn: async () => {
      const response = await api.get(`/conversations/${conversationId}/memory`);

      return response.data;
    },
  });
}
