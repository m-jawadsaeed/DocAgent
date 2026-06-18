import { useMutation, useQueryClient } from "@tanstack/react-query";

import { documentService } from "../services/document.service";

import type{ Document } from "../types/document.types";

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentService.deleteDocument,

    onMutate: async (documentId) => {
      await queryClient.cancelQueries({
        queryKey: ["documents"],
      });

      const previous = queryClient.getQueryData<Document[]>(["documents"]);

      queryClient.setQueryData<Document[]>(
        ["documents"],

        (old) => old?.filter((document) => document.id !== documentId) ?? [],
      );

      return {
        previous,
      };
    },

    onError: (_error, _documentId, context) => {
      queryClient.setQueryData(["documents"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },
  });
}
