"use client";

import { useState } from "react";
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
import { useParams } from "@tanstack/react-router";

const steps = [
  { id: "person", title: "Dados da pessoa" },
  { id: "address", title: "Endereço" },
  { id: "relatives", title: "Familiares" },
  { id: "courses", title: "Cursos" },
  { id: "assistances", title: "Assistências" },
  { id: "documents", title: "Documentos" },
];

// Person
interface PersonFields {
  fullName: string;
  cpf: string;
  birthDate: string;
  phoneNumber: string;
  fatherName: string;
  motherName: string;
  educationLevel: string;
  receivesBolsaFamilia: boolean;
  nis: string;
}

// Address
interface AddressFields {
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
}

// PersonRelative (um item; pode expandir para lista depois)
interface RelativeFields {
  relativeName: string;
  degree: string;
  degreeText: string;
  relativePhoneNumber: string;
}

// PersonCourse (um item)
interface CourseFields {
  courseId: string;
  enrolledAt: string;
  completedAt: string;
  courseNotes: string;
}

// PersonAssistance (um item)
interface AssistanceFields {
  assistanceTypeId: string;
  receivedAt: string;
  quantity: string;
  valueCents: string;
  assistanceNotes: string;
}

// PersonDocument (um item)
interface DocumentFields {
  documentType: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
}

type FormData = PersonFields &
  AddressFields &
  RelativeFields &
  CourseFields &
  AssistanceFields &
  DocumentFields;

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cpf: "",
    birthDate: "",
    phoneNumber: "",
    fatherName: "",
    motherName: "",
    educationLevel: "",
    receivesBolsaFamilia: false,
    nis: "",
    cep: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
    relativeName: "",
    degree: "",
    degreeText: "",
    relativePhoneNumber: "",
    courseId: "",
    enrolledAt: "",
    completedAt: "",
    courseNotes: "",
    assistanceTypeId: "",
    receivedAt: "",
    quantity: "",
    valueCents: "",
    assistanceNotes: "",
    documentType: "WALLET_PHOTO",
    fileUrl: "",
    fileName: "",
    mimeType: "",
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.fullName.trim() !== "" &&
          formData.cpf.trim() !== "" &&
          formData.birthDate.trim() !== ""
        );
      case 1:
        return (
          formData.cep.trim() !== "" &&
          formData.neighborhood.trim() !== "" &&
          formData.street.trim() !== "" &&
          formData.number.trim() !== ""
        );
      default:
        return true;
    }
  };

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
          {steps.map((step, index) => (
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
                    setCurrentStep(index);
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
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
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
                  <>
                    <CardHeader>
                      <CardTitle>Dados da pessoa</CardTitle>
                      <CardDescription>
                        Informações pessoais básicas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        variants={fadeInUp}
                        className="space-y-2 sm:col-span-2"
                      >
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            updateFormData("fullName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={formData.cpf}
                          onChange={(e) =>
                            updateFormData("cpf", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="birthDate">Data de nascimento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            updateFormData("birthDate", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phoneNumber">Telefone</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            updateFormData("phoneNumber", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Escolaridade</Label>
                        <Select
                          value={formData.educationLevel}
                          onValueChange={(value) =>
                            updateFormData("educationLevel", value)
                          }
                        >
                          <SelectTrigger className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
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
                            <SelectItem value="POSTGRAD">
                              Pós-graduação
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="fatherName">Nome do pai</Label>
                        <Input
                          id="fatherName"
                          value={formData.fatherName}
                          onChange={(e) =>
                            updateFormData("fatherName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="motherName">Nome da mãe</Label>
                        <Input
                          id="motherName"
                          value={formData.motherName}
                          onChange={(e) =>
                            updateFormData("motherName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-4 col-span-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                          id="receivesBolsaFamilia"
                          checked={formData.receivesBolsaFamilia}
                          onCheckedChange={(checked) =>
                            updateFormData("receivesBolsaFamilia", !!checked)
                          }
                        />
                        <Label htmlFor="receivesBolsaFamilia">
                          Recebe Bolsa Família
                        </Label>
                        </div>
                        <Label htmlFor="nis">NIS</Label>
                        <Input
                          id="nis"
                          value={formData.nis}
                          onChange={(e) =>
                            updateFormData("nis", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 1: Address */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Endereço</CardTitle>
                      <CardDescription>Endereço da pessoa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) =>
                            updateFormData("cep", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) =>
                            updateFormData("neighborhood", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) =>
                            updateFormData("street", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) =>
                            updateFormData("number", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          value={formData.complement}
                          onChange={(e) =>
                            updateFormData("complement", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
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
                            updateFormData("relativeName", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Grau de parentesco</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(value) =>
                            updateFormData("degree", value)
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
                            updateFormData("degreeText", e.target.value)
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
                            updateFormData(
                              "relativePhoneNumber",
                              e.target.value,
                            )
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
                            updateFormData("courseId", value)
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
                            updateFormData("enrolledAt", e.target.value)
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
                            updateFormData("completedAt", e.target.value)
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
                            updateFormData("courseNotes", e.target.value)
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
                            updateFormData("assistanceTypeId", value)
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
                            updateFormData("receivedAt", e.target.value)
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
                            updateFormData("quantity", e.target.value)
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
                            updateFormData("valueCents", e.target.value)
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
                            updateFormData("assistanceNotes", e.target.value)
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
                            updateFormData("documentType", value)
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
                            updateFormData("fileUrl", e.target.value)
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
                            updateFormData("fileName", e.target.value)
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
                            updateFormData("mimeType", e.target.value)
                          }
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  onClick={
                    currentStep === steps.length - 1 ? handleSubmit : nextStep
                  }
                  disabled={!isStepValid() || isSubmitting}
                  className={cn(
                    "flex items-center gap-1 transition-all duration-300 rounded-2xl",
                    currentStep === steps.length - 1 ? "" : "",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "Submit" : "Next"}
                      {currentStep === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
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
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
