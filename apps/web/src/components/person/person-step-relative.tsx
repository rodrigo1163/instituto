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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KINSHIP_DEGREES,
  type CreateRelativeInput,
} from "@/api/create-relative";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepFooter } from "./person-step-footer";
import { useSearch } from "@tanstack/react-router";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const relativeSchema = z.object({
  relativeName: z.string().min(1, "Nome do familiar é obrigatório"),
  degree: z.enum(KINSHIP_DEGREES, {
    required_error: "Grau de parentesco é obrigatório",
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

export function PersonStepRelative() {
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();

  const form = useForm<RelativeSchema>({
    resolver: zodResolver(relativeSchema),
    defaultValues: {
      relativeName: "",
      degree: undefined,
      degreeText: "",
      relativePhoneNumber: "",
    },
  });

  async function handleSubmit(data: RelativeSchema) {
    const body: CreateRelativeInput = {
      relativeName: data.relativeName,
      degree: data.degree,
      degreeText: data.degreeText || undefined,
      phoneNumber: data.relativePhoneNumber || undefined,
    };
    await handleSubmitPersonStep<CreateRelativeInput>(body);
  }

  return (
    <form
      id="form-rhf-relative"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <CardHeader>
        <CardTitle>Familiares</CardTitle>
        <CardDescription>Dados de um familiar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div variants={fadeInUp} className="space-y-2">
          <Controller
            name="relativeName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-relative-relativeName">
                  Nome do familiar
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-relative-relativeName"
                  aria-invalid={fieldState.invalid}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </motion.div>
        <motion.div variants={fadeInUp} className="space-y-2">
          <Controller
            name="degree"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-relative-degree">
                  Grau de parentesco
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-relative-degree"
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
        </motion.div>
        <motion.div variants={fadeInUp} className="space-y-2">
          <Controller
            name="degreeText"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-relative-degreeText">
                  Parentesco (se Outro)
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-relative-degreeText"
                  aria-invalid={fieldState.invalid}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </motion.div>
        <motion.div variants={fadeInUp} className="space-y-2">
          <Controller
            name="relativePhoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-relative-relativePhoneNumber">
                  Telefone do familiar
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-relative-relativePhoneNumber"
                  aria-invalid={fieldState.invalid}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </motion.div>
      </CardContent>

      <PersonStepFooter />
    </form>
  );
}
