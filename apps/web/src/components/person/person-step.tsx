"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepPerson } from "./person-step-person";
import { PersonStepAddress } from "./person-step-address";
import { PersonStepFooter } from "./person-step-footer";

export const PERSON_STEPS = [
  { id: "person", title: "Dados da pessoa" },
  { id: "address", title: "Endereço" },
  { id: "relatives", title: "Familiares" },
  { id: "courses", title: "Cursos" },
  { id: "assistances", title: "Assistências" },
  { id: "documents", title: "Documentos" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const OnboardingForm = () => {
  useParams({ strict: false });
  const navigate = useNavigate({ from: "/$slug/persons/new" });
  const { currentStep, formData } = usePersonStep();

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2">
          {PERSON_STEPS.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={cn(
                  "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-muted",
                )}
                onClick={() => {
                  // Only allow going back or to completed steps
                  if (index <= currentStep) {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        step: index,
                      }),
                    });
                  }
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className={cn(
                  "text-xs mt-1.5 hidden sm:block",
                  index === currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
              >
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentStep / (PERSON_STEPS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border shadow-md rounded-3xl overflow-hidden">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {/* Step 0: Person */}
                {currentStep === 0 && (
                  <Suspense fallback={<div>Carregando...</div>}>
                    <PersonStepPerson />
                  </Suspense>
                )}

                {/* Step 1: Address */}
                {currentStep === 1 && (
                  <Suspense fallback={<div>Carregando...</div>}>
                    <PersonStepAddress />
                  </Suspense>
                )}

                {/* Step 2: PersonRelative */}
                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle>Familiares</CardTitle>
                      <CardDescription>Dados de um familiar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="relativeName">Nome do familiar</Label>
                        <Input
                          id="relativeName"
                          value={formData.relativeName}
                          onChange={(e) =>
                            console.log("relativeName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Grau de parentesco</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(value) =>
                            console.log("degree", value)
                          }
                        >
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SPOUSE">Cônjuge</SelectItem>
                            <SelectItem value="CHILD">Filho(a)</SelectItem>
                            <SelectItem value="FATHER">Pai</SelectItem>
                            <SelectItem value="MOTHER">Mãe</SelectItem>
                            <SelectItem value="SIBLING">Irmão(ã)</SelectItem>
                            <SelectItem value="GRANDPARENT">Avô(ó)</SelectItem>
                            <SelectItem value="GRANDCHILD">Neto(a)</SelectItem>
                            <SelectItem value="UNCLE_AUNT">Tio(a)</SelectItem>
                            <SelectItem value="NEPHEW_NIECE">
                              Sobrinho(a)
                            </SelectItem>
                            <SelectItem value="COUSIN">Primo(a)</SelectItem>
                            <SelectItem value="OTHER">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="degreeText">
                          Parentesco (se Outro)
                        </Label>
                        <Input
                          id="degreeText"
                          value={formData.degreeText}
                          onChange={(e) =>
                            console.log("degreeText", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="relativePhoneNumber">
                          Telefone do familiar
                        </Label>
                        <Input
                          id="relativePhoneNumber"
                          value={formData.relativePhoneNumber}
                          onChange={(e) =>
                            console.log("relativePhoneNumber", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 3: PersonCourse */}
                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle>Cursos</CardTitle>
                      <CardDescription>Matrícula em curso</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Curso</Label>
                        <Select
                          value={formData.courseId}
                          onValueChange={(value) =>
                            console.log("courseId", value)
                          }
                        >
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Selecione o curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* itens virão da API de cursos */}
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="enrolledAt">Data de matrícula</Label>
                        <Input
                          id="enrolledAt"
                          type="date"
                          value={formData.enrolledAt}
                          onChange={(e) =>
                            console.log("enrolledAt", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="completedAt">Data de conclusão</Label>
                        <Input
                          id="completedAt"
                          type="date"
                          value={formData.completedAt}
                          onChange={(e) =>
                            console.log("completedAt", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="courseNotes">Observações</Label>
                        <Textarea
                          id="courseNotes"
                          value={formData.courseNotes}
                          onChange={(e) =>
                            console.log("courseNotes", e.target.value)
                          }
                          className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 4: PersonAssistance */}
                {currentStep === 4 && (
                  <>
                    <CardHeader>
                      <CardTitle>Assistências</CardTitle>
                      <CardDescription>
                        Registro de assistência/auxílio
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Tipo de assistência</Label>
                        <Select
                          value={formData.assistanceTypeId}
                          onValueChange={(value) =>
                            console.log("assistanceTypeId", value)
                          }
                        >
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* itens virão da API de tipos de assistência */}
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="receivedAt">Data de recebimento</Label>
                        <Input
                          id="receivedAt"
                          type="date"
                          value={formData.receivedAt}
                          onChange={(e) =>
                            console.log("receivedAt", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) =>
                            console.log("quantity", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="valueCents">Valor (centavos)</Label>
                        <Input
                          id="valueCents"
                          type="number"
                          value={formData.valueCents}
                          onChange={(e) =>
                            console.log("valueCents", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="assistanceNotes">Observações</Label>
                        <Textarea
                          id="assistanceNotes"
                          value={formData.assistanceNotes}
                          onChange={(e) =>
                            console.log("assistanceNotes", e.target.value)
                          }
                          className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 5: PersonDocument */}
                {currentStep === 5 && (
                  <>
                    <CardHeader>
                      <CardTitle>Documentos</CardTitle>
                      <CardDescription>
                        Documento da pessoa (ex.: foto da carteira)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Tipo de documento</Label>
                        <Select
                          value={formData.documentType}
                          onValueChange={(value) =>
                            console.log("documentType", value)
                          }
                        >
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WALLET_PHOTO">
                              Foto da carteira
                            </SelectItem>
                            <SelectItem value="OTHER">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="fileUrl">URL do arquivo</Label>
                        <Input
                          id="fileUrl"
                          value={formData.fileUrl}
                          onChange={(e) =>
                            console.log("fileUrl", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="fileName">Nome do arquivo</Label>
                        <Input
                          id="fileName"
                          value={formData.fileName}
                          onChange={(e) =>
                            console.log("fileName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="mimeType">Tipo MIME</Label>
                        <Input
                          id="mimeType"
                          value={formData.mimeType}
                          onChange={(e) =>
                            console.log("mimeType", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Step {currentStep + 1} of {PERSON_STEPS.length}:{" "}
        {PERSON_STEPS[currentStep].title}
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
