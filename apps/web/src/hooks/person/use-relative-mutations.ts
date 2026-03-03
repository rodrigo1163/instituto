import { createRelative } from "@/api/create-relative";
import type { CreateRelativeInput } from "@/api/create-relative";
import { updateRelative } from "@/api/update-relative";
import type { UpdateRelativeInput } from "@/api/update-relative";
import { removeRelative } from "@/api/remove-relative";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";

export function useCreateRelative() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRelativeInput | CreateRelativeInput[]) =>
      createRelative({
        slug: slug!,
        personId: personId!,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatives", slug, personId] });
    },
  });
}

export function useUpdateRelative() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      relativeId,
      body,
    }: {
      relativeId: string;
      body: UpdateRelativeInput;
    }) =>
      updateRelative({
        slug: slug!,
        personId: personId!,
        relativeId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatives", slug, personId] });
    },
  });
}

export function useRemoveRelative() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (relativeId: string) =>
      removeRelative({
        slug: slug!,
        personId: personId!,
        relativeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatives", slug, personId] });
    },
  });
}
