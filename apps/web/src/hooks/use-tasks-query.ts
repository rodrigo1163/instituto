import { useQuery } from "@tanstack/react-query";
import { getTasks, type GetTasksResponse } from "@/api/get-tasks";

export type { Todo, GetTasksResponse } from "@/api/get-tasks";

export function useTasksQuery() {
  return useQuery<GetTasksResponse, Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      return await getTasks();
    },
  });
}
