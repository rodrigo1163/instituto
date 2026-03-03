import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { useState, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KINSHIP_DEGREES,
  type CreateRelativeInput,
} from "@/api/create-relative";
import type { Relative } from "@/api/get-relatives";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepFooter } from "./person-step-footer";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSearch } from "@tanstack/react-router";
import { useGetRelatives } from "@/hooks/person/use-get-relatives";
import {
  useCreateRelative,
  useUpdateRelative,
  useRemoveRelative,
} from "@/hooks/person/use-relative-mutations";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const relativeSchema = z.object({
  id: z.string().optional(),
  relativeName: z.string().min(1, "Nome do familiar é obrigatório"),
  degree: z.enum(KINSHIP_DEGREES, {
    error: (issue) =>
      issue.input === undefined
        ? "Grau de parentesco é obrigatório"
        : "Valor inválido",
  }),
  degreeText: z.string().optional(),
  relativePhoneNumber: z.string().optional(),
}) satisfies z.ZodType<
  Omit<CreateRelativeInput, "phoneNumber"> & { relativePhoneNumber?: string }
>;

type RelativeSchema = z.infer<typeof relativeSchema>;

const DEGREE_LABELS: Record<RelativeSchema["degree"], string> = {
  SPOUSE: "Cônjuge",
  CHILD: "Filho(a)",
  FATHER: "Pai",
  MOTHER: "Mãe",
  SIBLING: "Irmão(ã)",
  GRANDPARENT: "Avô(ó)",
  GRANDCHILD: "Neto(a)",
  UNCLE_AUNT: "Tio(a)",
  NEPHEW_NIECE: "Sobrinho(a)",
  COUSIN: "Primo(a)",
  OTHER: "Outro",
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function parsePhone(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

function getAvatarStyle(degree: RelativeSchema["degree"]) {
  switch (degree) {
    case "MOTHER":
      return "bg-purple-500/20 text-purple-400";
    case "FATHER":
      return "bg-emerald-500/20 text-emerald-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

interface RelativeCardProps {
  relative: Relative;
  onEdit: () => void;
  onRemove: () => void;
}

function RelativeCard({ relative, onEdit, onRemove }: RelativeCardProps) {
  const degreeLabel =
    relative.degree === "OTHER" && relative.degreeText
      ? relative.degreeText
      : DEGREE_LABELS[relative.degree];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          getAvatarStyle(relative.degree),
        )}
      >
        <UserCircle className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{relative.relativeName}</p>
        <p className="text-sm text-muted-foreground">{degreeLabel}</p>
        {relative.phoneNumber && (
          <p className="text-sm text-muted-foreground">
            {formatPhone(relative.phoneNumber) || relative.phoneNumber}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="rounded-xl"
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="rounded-xl"
        >
          Remover
        </Button>
      </div>
    </div>
  );
}

interface RelativeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relative?: Relative | null;
  onSubmit: (data: RelativeSchema) => Promise<void>;
  isSubmitting: boolean;
}

function RelativeFormModal({
  open,
  onOpenChange,
  relative,
  onSubmit,
  isSubmitting,
}: RelativeFormModalProps) {
  const form = useForm<RelativeSchema>({
    resolver: zodResolver(relativeSchema),
    defaultValues: {
      id: undefined,
      relativeName: "",
      degree: undefined,
      degreeText: "",
      relativePhoneNumber: "",
    },
  });

  const degree = form.watch("degree");

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        form.reset({
          id: undefined,
          relativeName: "",
          degree: undefined,
          degreeText: "",
          relativePhoneNumber: "",
        });
      }
      onOpenChange(next);
    },
    [form, onOpenChange],
  );

  useEffect(() => {
    if (open) {
      if (relative) {
        form.reset({
          id: relative.id,
          relativeName: relative.relativeName,
          degree: relative.degree,
          degreeText: relative.degreeText ?? "",
          relativePhoneNumber: relative.phoneNumber
            ? formatPhone(relative.phoneNumber)
            : "",
        });
      } else {
        form.reset({
          id: undefined,
          relativeName: "",
          degree: undefined,
          degreeText: "",
          relativePhoneNumber: "",
        });
      }
    }
  }, [open, relative, form]);

  const handleSubmitForm = form.handleSubmit(async (data) => {
    await onSubmit(data);
    handleOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {relative ? "Editar Familiar" : "Adicionar Familiar"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmitForm(e);
          }}
          className="space-y-4"
        >
          <Controller
            name="relativeName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-relativeName">
                  Nome do familiar
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-relativeName"
                  aria-invalid={fieldState.invalid}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="degree"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-degree">
                  Grau de parentesco
                </FieldLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="modal-degree"
                    aria-invalid={fieldState.invalid}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(DEGREE_LABELS) as [RelativeSchema["degree"], string][]).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {degree === "OTHER" && (
            <Controller
              name="degreeText"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="modal-degreeText">
                    Parentesco (se Outro)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="modal-degreeText"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: Padrasto"
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name="relativePhoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-relativePhoneNumber">
                  Telefone do familiar
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-relativePhoneNumber"
                  aria-invalid={fieldState.invalid}
                  inputMode="numeric"
                  placeholder="(92) 99999-9999"
                  onChange={(e) =>
                    field.onChange(formatPhone(e.target.value))
                  }
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitForm}
              className="rounded-xl"
            >
              {isSubmitting ? "Salvando..." : "Salvar Familiar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PersonStepRelative() {
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { data } = useGetRelatives({ personId });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRelative, setEditingRelative] = useState<Relative | null>(null);
  const [deletingRelative, setDeletingRelative] = useState<Relative | null>(null);

  const createMutation = useCreateRelative();
  const updateMutation = useUpdateRelative();
  const removeMutation = useRemoveRelative();

  const relatives = data?.relatives ?? [];

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmitPersonStep(undefined);
  }

  async function handleModalSubmit(data: RelativeSchema) {
    const payload = {
      relativeName: data.relativeName,
      degree: data.degree,
      degreeText: data.degreeText || undefined,
      phoneNumber: data.relativePhoneNumber
        ? parsePhone(data.relativePhoneNumber)
        : undefined,
    };

    if (editingRelative) {
      await updateMutation.mutateAsync({
        relativeId: editingRelative.id,
        body: payload,
      });
      toast.success("Familiar atualizado com sucesso");
    } else {
      await createMutation.mutateAsync(payload as CreateRelativeInput);
      toast.success("Familiar adicionado com sucesso");
    }
  }

  function handleRemoveClick(relative: Relative) {
    setDeletingRelative(relative);
  }

  async function handleConfirmRemove() {
    if (!deletingRelative) return;
    await removeMutation.mutateAsync(deletingRelative.id);
    toast.success("Familiar removido");
    setDeletingRelative(null);
  }

  function handleEdit(relative: Relative) {
    setEditingRelative(relative);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingRelative(null);
    setModalOpen(true);
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <form id="form-rhf-relative" onSubmit={handleSubmitForm}>
        <CardHeader>
          <CardTitle>Familiares</CardTitle>
          <CardDescription>
            Cadastre pessoas com vínculo familiar ou responsáveis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lista de familiares cadastrados
            </h3>
            {relatives.length > 0 ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-2"
              >
                {relatives.map((relative) => (
                  <RelativeCard
                    key={relative.id}
                    relative={relative}
                    onEdit={() => handleEdit(relative)}
                    onRemove={() => handleRemoveClick(relative)}
                  />
                ))}
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                Nenhum familiar cadastrado. Clique em &quot;Adicionar Familiar&quot;
                para começar.
              </p>
            )}
          </div>
          <motion.div variants={fadeInUp}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAdd}
              className="rounded-xl"
            >
              + Adicionar Familiar
            </Button>
          </motion.div>
        </CardContent>

        <PersonStepFooter />
      </form>

      <RelativeFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        relative={editingRelative}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog open={!!deletingRelative} onOpenChange={(open) => !open && setDeletingRelative(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Remover familiar</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {deletingRelative?.relativeName} da lista de familiares? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingRelative(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={removeMutation.isPending}
              className="rounded-xl"
            >
              {removeMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
