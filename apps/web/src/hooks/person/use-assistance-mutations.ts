import { createAssistance } from "@/api/create-assistance";
import type { CreateAssistanceInput } from "@/api/create-assistance";
import { updateAssistance } from "@/api/update-assistance";
import type { UpdateAssistanceInput } from "@/api/update-assistance";
import { removeAssistance } from "@/api/remove-assistance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useCreateAssistance() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAssistanceInput) =>
      createAssistance({
        slug: slug!,
        personId: personId!,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assistances", slug, personId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Erro ao criar assistência");
      }
    },
  });
}

export function useUpdateAssistance() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assistanceId,
      body,
    }: {
      assistanceId: string;
      body: UpdateAssistanceInput;
    }) =>
      updateAssistance({
        slug: slug!,
        personId: personId!,
        assistanceId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assistances", slug, personId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Erro ao atualizar assistência");
      }
    },
  });
}

export function useRemoveAssistance() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assistanceId: string) =>
      removeAssistance({
        slug: slug!,
        personId: personId!,
        assistanceId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assistances", slug, personId],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Erro ao remover assistência");
      }
    },
  });
}
