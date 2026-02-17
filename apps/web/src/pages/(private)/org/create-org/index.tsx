import { createOrganization } from "@/api/create-organization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/(private)/org/create-org/")({
  component: RouteComponent,
});

const orgSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

type OrgSchema = z.infer<typeof orgSchema>;

function RouteComponent() {
  const navigate = useNavigate()
  const form = useForm<OrgSchema>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { mutateAsync: handleCreateOrgFn, isPending: isPendingCreateOrg } = useMutation({
    mutationFn: createOrganization,
    onSuccess: (_, varibles) => {
      toast.success("Instituição criada com sucesso")
      navigate({ to: `/$slug/dashboard`, params: { slug: varibles.slug } })
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      } else {
        toast.error("Erro ao criar instituição")
      }
    },
  })

  async function handleCreateOrg(data: OrgSchema) {
    await handleCreateOrgFn(data)
  }
  return (
    <div className="flex items-center justify-center h-screen">
       <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Criar Instituição</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para criar uma nova instituição.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(handleCreateOrg)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-name">
                    Nome do instituto
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome do instituto"
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-slug">
                    Slug da instituição
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-slug"
                    aria-invalid={fieldState.invalid}
                    placeholder="slug-da-instituicao"
                    autoComplete="slug"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isPendingCreateOrg}>
            Limpar
          </Button>
          <Button type="submit" form="form-rhf-input" disabled={isPendingCreateOrg}>
            Criar Instituição
          </Button>
        </Field>
      </CardFooter>
    </Card>
   </div>
  );
}
