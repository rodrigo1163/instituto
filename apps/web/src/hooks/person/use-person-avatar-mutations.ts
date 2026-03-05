import { createPersonAvatar } from "@/api/create-person-avatar";
import type { CreatePersonAvatarInput } from "@/api/create-person-avatar";
import { updatePersonAvatar } from "@/api/update-person-avatar";
import type { UpdatePersonAvatarInput } from "@/api/update-person-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useCreatePersonAvatar() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePersonAvatarInput) =>
      createPersonAvatar({
        slug: slug!,
        personId: personId!,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["person-avatar", slug, personId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Erro ao criar documento");
      }
    },
  });
}

export function useUpdatePersonAvatar() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      body,
    }: {
      documentId: string;
      body: UpdatePersonAvatarInput;
    }) =>
      updatePersonAvatar({
        slug: slug!,
        personId: personId!,
        documentId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["person-avatar", slug, personId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Erro ao atualizar documento");
      }
    },
  });
}
