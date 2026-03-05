import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
import type { Assistance } from "@/api/fetch-assistances";
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
import { useParams, useSearch } from "@tanstack/react-router";
import { useGetAssistances } from "@/hooks/person/use-get-assistances";
import {
  useCreateAssistance,
  useUpdateAssistance,
  useRemoveAssistance,
} from "@/hooks/person/use-assistance-mutations";
import { useFetchAssistanceTypes } from "@/hooks/assistance-type/use-fetch-assistance-types";
import { HandHeart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const assistanceSchema = z.object({
  assistanceTypeId: z.string().min(1, "Tipo de assistência é obrigatório"),
  receivedAt: z.string().optional(),
  quantity: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v === "") return undefined;
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? undefined : n;
    }),
  valueCents: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v === "") return undefined;
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? undefined : n;
    }),
  notes: z.string().optional(),
});

type AssistanceSchema = z.infer<typeof assistanceSchema>;

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(valueCents: number | null | undefined): string {
  if (valueCents == null) return "—";
  return (valueCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

interface AssistanceCardProps {
  assistance: Assistance;
  assistanceTypes: { id: string; name: string }[];
  onEdit: () => void;
  onRemove: () => void;
}

function AssistanceCard({
  assistance,
  assistanceTypes,
  onEdit,
  onRemove,
}: AssistanceCardProps) {
  const typeName =
    assistance.assistanceType?.name ??
    assistanceTypes.find((t) => t.id === assistance.assistanceTypeId)?.name ??
    "Tipo não encontrado";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary",
        )}
      >
        <HandHeart className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{typeName}</p>
        <p className="text-sm text-muted-foreground">
          Recebido em: {formatDate(assistance.receivedAt)}
        </p>
        {(assistance.quantity != null || assistance.valueCents != null) && (
          <p className="text-sm text-muted-foreground">
            {assistance.quantity != null && `Qtd: ${assistance.quantity}`}
            {assistance.quantity != null && assistance.valueCents != null && " • "}
            {assistance.valueCents != null &&
              formatCurrency(assistance.valueCents)}
          </p>
        )}
        {assistance.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assistance.notes}
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

interface AssistanceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistance?: Assistance | null;
  assistanceTypes: { id: string; name: string }[];
  onSubmit: (data: AssistanceSchema) => Promise<void>;
  isSubmitting: boolean;
}

function AssistanceFormModal({
  open,
  onOpenChange,
  assistance,
  assistanceTypes,
  onSubmit,
  isSubmitting,
}: AssistanceFormModalProps) {
  const isEditing = !!assistance;

  const form = useForm<AssistanceSchema>({
    resolver: zodResolver(assistanceSchema),
    defaultValues: {
      assistanceTypeId: "",
      receivedAt: "",
      quantity: "",
      valueCents: "",
      notes: "",
    },
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        form.reset({
          assistanceTypeId: "",
          receivedAt: "",
          quantity: "",
          valueCents: "",
          notes: "",
        });
      }
      onOpenChange(next);
    },
    [form, onOpenChange],
  );

  useEffect(() => {
    if (open) {
      if (assistance) {
        form.reset({
          assistanceTypeId: assistance.assistanceTypeId,
          receivedAt: toDateInputValue(assistance.receivedAt),
          quantity: assistance.quantity?.toString() ?? "",
          valueCents: assistance.valueCents?.toString() ?? "",
          notes: assistance.notes ?? "",
        });
      } else {
        form.reset({
          assistanceTypeId: "",
          receivedAt: "",
          quantity: "",
          valueCents: "",
          notes: "",
        });
      }
    }
  }, [open, assistance, form]);

  const handleSubmitForm = form.handleSubmit(async (data) => {
    await onSubmit(data);
    handleOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {assistance ? "Editar Assistência" : "Adicionar Assistência"}
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
            name="assistanceTypeId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-assistanceTypeId">
                  Tipo de assistência
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="modal-assistanceTypeId"
                    aria-invalid={fieldState.invalid}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assistanceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="receivedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-receivedAt">
                  Data de recebimento
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-receivedAt"
                  type="date"
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
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-quantity">Quantidade</FieldLabel>
                <Input
                  {...field}
                  id="modal-quantity"
                  type="number"
                  min={0}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex: 1"
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="valueCents"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-valueCents">
                  Valor (centavos)
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-valueCents"
                  type="number"
                  min={0}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex: 1000"
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-notes">Observações</FieldLabel>
                <Textarea
                  {...field}
                  id="modal-notes"
                  aria-invalid={fieldState.invalid}
                  placeholder="Observações sobre a assistência"
                  className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PersonStepAssistance() {
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { slug } = useParams({ strict: false });
  const { data } = useGetAssistances({ personId });
  const { data: assistanceTypesData } = useFetchAssistanceTypes(slug);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssistance, setEditingAssistance] =
    useState<Assistance | null>(null);
  const [deletingAssistance, setDeletingAssistance] =
    useState<Assistance | null>(null);

  const createMutation = useCreateAssistance();
  const updateMutation = useUpdateAssistance();
  const removeMutation = useRemoveAssistance();

  const assistances = data?.assistances ?? [];
  const assistanceTypes = assistanceTypesData?.assistanceTypes ?? [];

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmitPersonStep(undefined);
  }

  async function handleModalSubmit(data: AssistanceSchema) {
    if (editingAssistance) {
      await updateMutation.mutateAsync({
        assistanceId: editingAssistance.id,
        body: {
          receivedAt: data.receivedAt
            ? new Date(data.receivedAt).toISOString()
            : undefined,
          quantity: data.quantity ?? null,
          valueCents: data.valueCents ?? null,
          notes: data.notes || null,
        },
      });
      toast.success("Assistência atualizada com sucesso");
    } else {
      await createMutation.mutateAsync({
        assistanceTypeId: data.assistanceTypeId,
        receivedAt: data.receivedAt
          ? new Date(data.receivedAt).toISOString()
          : undefined,
        quantity: data.quantity,
        valueCents: data.valueCents,
        notes: data.notes,
      });
      toast.success("Assistência adicionada com sucesso");
    }
  }

  function handleRemoveClick(assistance: Assistance) {
    setDeletingAssistance(assistance);
  }

  async function handleConfirmRemove() {
    if (!deletingAssistance) return;
    await removeMutation.mutateAsync(deletingAssistance.id);
    toast.success("Assistência removida");
    setDeletingAssistance(null);
  }

  function handleEdit(assistance: Assistance) {
    setEditingAssistance(assistance);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingAssistance(null);
    setModalOpen(true);
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <form id="form-rhf-assistance" onSubmit={handleSubmitForm}>
        <CardHeader>
          <CardTitle>Assistências</CardTitle>
          <CardDescription>
            Registro de assistência/auxílio. Cadastre as assistências recebidas
            pela pessoa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lista de assistências cadastradas
            </h3>
            {assistances.length > 0 ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-2"
              >
                {assistances.map((assistance) => (
                  <AssistanceCard
                    key={assistance.id}
                    assistance={assistance}
                    assistanceTypes={assistanceTypes}
                    onEdit={() => handleEdit(assistance)}
                    onRemove={() => handleRemoveClick(assistance)}
                  />
                ))}
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                Nenhuma assistência cadastrada. Clique em &quot;Adicionar
                Assistência&quot; para começar.
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
              + Adicionar Assistência
            </Button>
          </motion.div>
        </CardContent>

        <PersonStepFooter />
      </form>

      <AssistanceFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        assistance={editingAssistance}
        assistanceTypes={assistanceTypes}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog
        open={!!deletingAssistance}
        onOpenChange={(open) => !open && setDeletingAssistance(null)}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Remover assistência</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a assistência de{" "}
              {deletingAssistance?.assistanceType?.name ??
                assistanceTypes.find(
                  (t) => t.id === deletingAssistance?.assistanceTypeId,
                )?.name ??
                "este tipo"}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingAssistance(null)}
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
