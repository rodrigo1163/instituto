import { createEnrollment } from "@/api/create-enrollment";
import type { CreateEnrollmentInput } from "@/api/create-enrollment";
import { updateEnrollment } from "@/api/update-enrollment";
import type { UpdateEnrollmentInput } from "@/api/update-enrollment";
import { removeEnrollment } from "@/api/remove-enrollment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";

export function useCreateEnrollment() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEnrollmentInput) =>
      createEnrollment({
        slug: slug!,
        personId: personId!,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", slug, personId] });
    },
  });
}

export function useUpdateEnrollment() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      body,
    }: {
      enrollmentId: string;
      body: UpdateEnrollmentInput;
    }) =>
      updateEnrollment({
        slug: slug!,
        personId: personId!,
        enrollmentId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", slug, personId] });
    },
  });
}

export function useRemoveEnrollment() {
  const { slug } = useParams({ strict: false });
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) =>
      removeEnrollment({
        slug: slug!,
        personId: personId!,
        enrollmentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", slug, personId] });
    },
  });
}
