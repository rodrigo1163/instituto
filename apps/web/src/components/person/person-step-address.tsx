import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepFooter } from "./person-step-footer";
import { useSearch } from "@tanstack/react-router";
import { useGetAddress } from "@/hooks/address/use-get-address";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const addressSchema = z.object({
  cep: z.string().min(1, "CEP é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
});

type AddressSchema = z.infer<typeof addressSchema>;

export function PersonStepAddress() {
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { handleSubmit: handleSubmitPersonStep } = usePersonStep();
  const { data, error: addressError } = useGetAddress({ personId });

  const form = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: data?.address?.cep ?? "",
      neighborhood: data?.address?.neighborhood ?? "",
      street: data?.address?.street ?? "",
      number: data?.address?.number ?? "",
      complement: data?.address?.complement ?? "",
    },
  });

  if (addressError) {
    return (
      <div>Erro ao carregar endereço: {addressError.message}</div>
    );
  }

  async function handleSubmit(data: AddressSchema) {
    await handleSubmitPersonStep<AddressSchema>(data);
  }

  return (
    <form id="form-rhf-address" onSubmit={form.handleSubmit(handleSubmit)}>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
        <CardDescription>Endereço da pessoa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div variants={fadeInUp} className="space-y-2">
            <Controller
              name="cep"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-address-cep">CEP</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-address-cep"
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
              name="neighborhood"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-address-neighborhood">
                    Bairro
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-address-neighborhood"
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
              name="street"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-address-street">Rua</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-address-street"
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
              name="number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-address-number">
                    Número
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-address-number"
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
              name="complement"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-address-complement">
                    Complemento
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-address-complement"
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
