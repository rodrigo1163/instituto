import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepFooter } from "./person-step-footer";
import { DocumentUploadZone } from "./document-upload-zone";
import { IdentityCardPreview } from "./identity-card-preview";
import { useSearch } from "@tanstack/react-router";
import { useGetPersonAvatar } from "@/hooks/person/use-get-person-avatar";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const documentsSchema = z.object({
  fileUrl: z.string().min(1, "Foto é obrigatória"),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
});

type DocumentsSchema = z.infer<typeof documentsSchema>;

export function PersonStepDocuments() {
  const { handleSubmit: handleSubmitPersonStep, formData } = usePersonStep();
  const { personId } = useSearch({ from: "/(private)/$slug/persons/new/" });
  const { data: avatarData } = useGetPersonAvatar({ personId });

  const form = useForm<DocumentsSchema>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      fileUrl: "",
      fileName: "",
      mimeType: "",
    },
  });

  const photoUrl = form.watch("fileUrl");
  const personName = formData.fullName;

  useEffect(() => {
    if (avatarData?.avatar) {
      form.reset({
        fileUrl: avatarData.avatar.fileUrl,
        fileName: avatarData.avatar.fileName ?? "",
        mimeType: avatarData.avatar.mimeType ?? "",
      });
    }
  }, [avatarData?.avatar, form]);

  async function handleSubmit(data: DocumentsSchema) {
    await handleSubmitPersonStep({
      ...data,
      type: "WALLET_PHOTO",
      documentId: avatarData?.avatar?.id,
    });
  }

  return (
    <form
      id="form-rhf-documents"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col"
    >
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>
          Documento da pessoa (ex.: foto da carteira 3×4)
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8",
        )}
      >
        <motion.div variants={fadeInUp} className="flex flex-col gap-4">
          <Controller
            name="fileUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <DocumentUploadZone
                value={
                  field.value
                    ? {
                        fileUrl: field.value,
                        fileName: form.getValues("fileName"),
                        mimeType: form.getValues("mimeType"),
                      }
                    : null
                }
                onChange={(val) => {
                  if (val) {
                    field.onChange(val.fileUrl);
                    form.setValue("fileName", val.fileName ?? "");
                    form.setValue("mimeType", val.mimeType ?? "");
                  } else {
                    field.onChange("");
                    form.setValue("fileName", "");
                    form.setValue("mimeType", "");
                  }
                }}
                error={fieldState.error?.message}
                aria-invalid={fieldState.invalid}
                id="form-rhf-documents-photo"
              />
            )}
          />
        </motion.div>
        <motion.div
          variants={fadeInUp}
          className="flex items-start justify-center lg:sticky lg:top-4"
        >
          <IdentityCardPreview
            photoUrl={photoUrl || undefined}
            personName={personName || undefined}
            className="w-full max-w-[280px]"
          />
        </motion.div>
      </CardContent>
      <PersonStepFooter />
    </form>
  );
}
