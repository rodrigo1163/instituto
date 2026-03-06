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
import type { CreateEnrollmentInput } from "@/api/create-enrollment";
import type { Enrollment } from "@/api/fetch-enrollments";
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
import { useGetEnrollments } from "@/hooks/person/use-get-enrollments";
import {
  useCreateEnrollment,
  useUpdateEnrollment,
  useRemoveEnrollment,
} from "@/hooks/person/use-enrollment-mutations";
import { useFetchCourses } from "@/hooks/course/use-fetch-courses";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const enrollmentSchema = z.object({
  courseId: z.string().min(1, "Curso é obrigatório"),
  enrolledAt: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
}) satisfies z.ZodType<CreateEnrollmentInput & { completedAt?: string }>;

type EnrollmentSchema = z.infer<typeof enrollmentSchema>;

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

interface EnrollmentCardProps {
  enrollment: Enrollment;
  onEdit: () => void;
  onRemove: () => void;
}

function EnrollmentCard({ enrollment, onEdit, onRemove }: EnrollmentCardProps) {
  const courseTitle = enrollment.course?.title ?? "Curso não encontrado";

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
        <GraduationCap className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{courseTitle} - {enrollment.course?.partner?.name ?? "Parceiro não encontrado"}</p>
        <p className="text-sm text-muted-foreground">
          Matrícula: {formatDate(enrollment.enrolledAt)}
        </p>
        {enrollment.completedAt && (
          <p className="text-sm text-muted-foreground">
            Conclusão: {formatDate(enrollment.completedAt)}
          </p>
        )}
        {enrollment.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {enrollment.notes}
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

interface EnrollmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment?: Enrollment | null;
  courses: { id: string; title: string, partner: { id: string; name: string } }[];
  onSubmit: (data: EnrollmentSchema) => Promise<void>;
  isSubmitting: boolean;
}

function EnrollmentFormModal({
  open,
  onOpenChange,
  enrollment,
  courses,
  onSubmit,
  isSubmitting,
}: EnrollmentFormModalProps) {
  const isEditing = !!enrollment;

  const form = useForm<EnrollmentSchema>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      courseId: "",
      enrolledAt: "",
      completedAt: "",
      notes: "",
    },
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        form.reset({
          courseId: "",
          enrolledAt: "",
          completedAt: "",
          notes: "",
        });
      }
      onOpenChange(next);
    },
    [form, onOpenChange],
  );

  useEffect(() => {
    if (open) {
      if (enrollment) {
        form.reset({
          courseId: enrollment.courseId,
          enrolledAt: toDateInputValue(enrollment.enrolledAt),
          completedAt: toDateInputValue(enrollment.completedAt),
          notes: enrollment.notes ?? "",
        });
      } else {
        form.reset({
          courseId: "",
          enrolledAt: "",
          completedAt: "",
          notes: "",
        });
      }
    }
  }, [open, enrollment, form]);

  const handleSubmitForm = form.handleSubmit(async (data) => {
    await onSubmit(data);
    handleOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {enrollment ? "Editar Matrícula" : "Adicionar Curso"}
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
            name="courseId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-courseId">Curso</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="modal-courseId"
                    aria-invalid={fieldState.invalid}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                        <span className="text-xs text-muted-foreground">
                          {course.partner.name}
                        </span>
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
            name="enrolledAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-enrolledAt">
                  Data de matrícula
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-enrolledAt"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  disabled={isEditing}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="completedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-completedAt">
                  Data de conclusão
                </FieldLabel>
                <Input
                  {...field}
                  id="modal-completedAt"
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
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="modal-notes">Observações</FieldLabel>
                <Textarea
                  {...field}
                  id="modal-notes"
                  aria-invalid={fieldState.invalid}
                  placeholder="Observações sobre o curso"
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

export function PersonStepCourse() {
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { slug } = useParams({ strict: false });
  const { data } = useGetEnrollments({ personId });
  const { data: coursesData } = useFetchCourses(slug);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [deletingEnrollment, setDeletingEnrollment] =
    useState<Enrollment | null>(null);

  const createMutation = useCreateEnrollment();
  const updateMutation = useUpdateEnrollment();
  const removeMutation = useRemoveEnrollment();

  const enrollments = data?.enrollments ?? [];
  const courses = coursesData?.courses ?? [];

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmitPersonStep(undefined);
  }

  async function handleModalSubmit(data: EnrollmentSchema) {
    const payload = {
      courseId: data.courseId,
      enrolledAt: data.enrolledAt || undefined,
      notes: data.notes || undefined,
    };

    if (editingEnrollment) {
      await updateMutation.mutateAsync({
        enrollmentId: editingEnrollment.id,
        body: {
          completedAt: data.completedAt
            ? new Date(data.completedAt).toISOString()
            : null,
          notes: data.notes || null,
        },
      });
      toast.success("Matrícula atualizada com sucesso");
    } else {
      await createMutation.mutateAsync({
        ...payload,
        enrolledAt: data.enrolledAt
          ? new Date(data.enrolledAt).toISOString()
          : undefined,
      });
      toast.success("Curso adicionado com sucesso");
    }
  }

  function handleRemoveClick(enrollment: Enrollment) {
    setDeletingEnrollment(enrollment);
  }

  async function handleConfirmRemove() {
    if (!deletingEnrollment) return;
    await removeMutation.mutateAsync(deletingEnrollment.id);
    toast.success("Matrícula removida");
    setDeletingEnrollment(null);
  }

  function handleEdit(enrollment: Enrollment) {
    setEditingEnrollment(enrollment);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingEnrollment(null);
    setModalOpen(true);
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <form id="form-rhf-course" onSubmit={handleSubmitForm}>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>
            Matrícula em cursos. Cadastre os cursos em que a pessoa está ou esteve
            matriculada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lista de cursos cadastrados
            </h3>
            {enrollments.length > 0 ? (
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-2"
              >
                {enrollments.map((enrollment) => (
                  <EnrollmentCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    onEdit={() => handleEdit(enrollment)}
                    onRemove={() => handleRemoveClick(enrollment)}
                  />
                ))}
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                Nenhum curso cadastrado. Clique em &quot;Adicionar Curso&quot; para
                começar.
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
              + Adicionar Curso
            </Button>
          </motion.div>
        </CardContent>

        <PersonStepFooter />
      </form>

      <EnrollmentFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        enrollment={editingEnrollment}
        courses={courses}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />

      <Dialog
        open={!!deletingEnrollment}
        onOpenChange={(open) => !open && setDeletingEnrollment(null)}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Remover matrícula</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a matrícula em{" "}
              {deletingEnrollment?.course?.title ?? "este curso"}? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingEnrollment(null)}
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
