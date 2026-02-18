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
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EDUCATION_LEVELS, type CreatePersonInput } from "@/api/upsert-person";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepFooter } from "./person-step-footer";
import { useSearch } from "@tanstack/react-router";
import { useGetPerson } from "@/hooks/person/use-get-person";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const personSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  birthDate: z.union([
    z.date(),
    z.string().min(1, "Data de nascimento é obrigatória"),
  ]),
  phoneNumber: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  educationLevel: z.enum(EDUCATION_LEVELS).optional(),
  receivesBolsaFamilia: z.boolean().optional(),
  nis: z.string().optional(),
}) satisfies z.ZodType<CreatePersonInput>;

type PersonSchema = z.infer<typeof personSchema>;


export function PersonStepPerson() {
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();
  const { data, error: personError } = useGetPerson({ personId: personId });

  const form = useForm<PersonSchema>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      fullName: data?.person.fullName || "",
      cpf: data?.person.cpf || "",
      birthDate: data?.person.birthDate || "",
      phoneNumber: data?.person.phoneNumber || "",
      fatherName: data?.person.fatherName || "",
      motherName: data?.person.motherName || "",
      educationLevel: data?.person.educationLevel || undefined,
      receivesBolsaFamilia: data?.person.receivesBolsaFamilia || false,
      nis: data?.person.nis || "",
    },
  });

  async function handleSubmit(data: PersonSchema) {
    const body = {
      ...data,
      id: personId || undefined,
    };
    await handleSubmitPersonStep<PersonSchema>(body);
  }

  if (personError) {
    return <div>Erro ao carregar pessoa: {personError.message}</div>;
  }

  return (
    <form id="form-rhf-person" onSubmit={form.handleSubmit(handleSubmit)}>
      <CardHeader>
        <CardTitle>Dados da pessoa</CardTitle>
        <CardDescription>Informações pessoais básicas</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeInUp} className="sm:col-span-2">
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-fullName">
                    Nome completo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-fullName"
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
          <motion.div variants={fadeInUp}>
            <Controller
              name="cpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-cpf">CPF</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-cpf"
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
          <motion.div variants={fadeInUp}>
            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => {
                const value =
                  field.value instanceof Date
                    ? field.value.toISOString().split("T")[0]
                    : field.value || "";

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-person-birthDate">
                      Data de nascimento
                    </FieldLabel>
                    <Input
                      id="form-rhf-person-birthDate"
                      name={field.name}
                      value={value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      type="date"
                      aria-invalid={fieldState.invalid}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-phoneNumber">
                    Telefone
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-phoneNumber"
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
          <motion.div variants={fadeInUp}>
            <Controller
              name="educationLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-educationLevel">
                    Escolaridade
                  </FieldLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-person-educationLevel"
                      className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Nenhuma</SelectItem>
                      <SelectItem value="ELEMENTARY_INCOMPLETE">
                        Fundamental incompleto
                      </SelectItem>
                      <SelectItem value="ELEMENTARY_COMPLETE">
                        Fundamental completo
                      </SelectItem>
                      <SelectItem value="HIGH_SCHOOL_INCOMPLETE">
                        Médio incompleto
                      </SelectItem>
                      <SelectItem value="HIGH_SCHOOL_COMPLETE">
                        Médio completo
                      </SelectItem>
                      <SelectItem value="TECHNICAL">Técnico</SelectItem>
                      <SelectItem value="UNIVERSITY_INCOMPLETE">
                        Superior incompleto
                      </SelectItem>
                      <SelectItem value="UNIVERSITY_COMPLETE">
                        Superior completo
                      </SelectItem>
                      <SelectItem value="POSTGRAD">Pós-graduação</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Controller
              name="fatherName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-fatherName">
                    Nome do pai
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-fatherName"
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
          <motion.div variants={fadeInUp}>
            <Controller
              name="motherName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-motherName">
                    Nome da mãe
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-motherName"
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
          <motion.div variants={fadeInUp} className="sm:col-span-2">
            <Controller
              name="receivesBolsaFamilia"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="form-rhf-person-receivesBolsaFamilia"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="form-rhf-person-receivesBolsaFamilia">
                      Recebe Bolsa Família
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="sm:col-span-2">
            <Controller
              name="nis"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-person-nis">NIS</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-person-nis"
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
        </FieldGroup>
      </CardContent>

      <PersonStepFooter />
    </form>
  );
}
