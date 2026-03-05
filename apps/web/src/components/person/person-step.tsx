"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PersonStepPerson } from "./person-step-person";
import { PersonStepAddress } from "./person-step-address";
import { PersonStepRelative } from "./person-step-relative";
import { PersonStepCourse } from "./person-step-course";
import { PersonStepAssistance } from "./person-step-assistance";

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
                  <Suspense fallback={<div>Carregando...</div>}>
                    <PersonStepRelative />
                  </Suspense>
                )}

                {/* Step 3: PersonCourse */}
                {currentStep === 3 && (
                  <Suspense fallback={<div>Carregando...</div>}>
                    <PersonStepCourse />
                  </Suspense>
                )}

                {/* Step 4: PersonAssistance */}
                {currentStep === 4 && (
                  <Suspense fallback={<div>Carregando...</div>}>
                    <PersonStepAssistance />
                  </Suspense>
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
