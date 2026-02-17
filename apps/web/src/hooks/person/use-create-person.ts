import {
  createPerson,
  type CreatePersonInput,
  type CreatePersonResponse,
} from "@/api/create-person";
import { useMutation } from "@tanstack/react-query";

export function useCreatePerson(slug: string) {
  return useMutation<CreatePersonResponse, Error, CreatePersonInput>({
    mutationFn: (body) => createPerson({ slug, body }),
  });
}
