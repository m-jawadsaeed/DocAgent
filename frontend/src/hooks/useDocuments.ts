import { useQuery } from "@tanstack/react-query";

import { api } from "../api/client";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],

    queryFn: async () => {
      const response = await api.get("/documents");

      return response.data;
    },
  });
}
