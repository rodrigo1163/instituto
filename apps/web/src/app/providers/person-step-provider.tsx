import { upsertPerson } from "@/api/upsert-person";
import { PERSON_STEPS } from "@/components/person/person-step";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";

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

interface PersonStepContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  isSubmitting: boolean;
  handleSubmit: <T>(data: T) => Promise<void>;
  isStepValid: () => boolean
}

interface PersonStepProvider {
  children: ReactNode;
}

const PersonStepContext = createContext({} as PersonStepContextType);

export function PersonStepProvider({ children }: PersonStepProvider) {
  const { slug } = useParams({ strict: false });
  const navigate = useNavigate({ from: "/$slug/persons/new"})

  const [currentStep, setCurrentStep] = useState(0);
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

  const stepFunction = [upsertPerson] as const;

  const { mutateAsync: upsertPersonFn, isPending } = useMutation<
    any,
    Error,
    any
  >({
    mutationFn: (body) => stepFunction[currentStep]({ slug: slug!, body }),
    onSuccess: (data) => {
      const personId = data.id || undefined;
      toast.success("Salvo com sucesso");
      
      nextStep(personId);
    },
    onError: (error) => {
      console.log("error", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Erro ao salvar");
    },
  });

  const isSubmitting = isPending;

  const nextStep = (personId?: string) => {
    if (currentStep < PERSON_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
    if (currentStep === 0) {
      navigate({
        search: (prev) => ({
          ...prev,
          personId: personId || undefined
        }),
        replace: true
      })  
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
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
  
  async function handleSubmit<T>(data: T) {
    await upsertPersonFn(data);
  }

  return (
    <PersonStepContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        formData,
        setFormData,
        isSubmitting,
        handleSubmit,
        isStepValid,
      }}
    >
      {children}
    </PersonStepContext.Provider>
  );
}

export function usePersonStep() {
  const context = useContext(PersonStepContext);

  if (!context) {
    throw new Error("usePersonStep must be used within an PersonStepProvider");
  }

  return context;
}
