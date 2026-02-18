import { api } from "@/lib/axios";
import { useParams } from "@tanstack/react-router";

export interface GetPersonParams {
  personId: string | undefined;
  slug: string;
}
export interface GetPersonResponse { 
  person: {
    id: string;
    fullName: string;
    cpf: string;
    birthDate: Date;
    phoneNumber: string | null;
    fatherName: string | null;
    motherName: string | null;
    organizationId: string;
    educationLevel: "NONE" | "ELEMENTARY_INCOMPLETE" | "ELEMENTARY_COMPLETE" | "HIGH_SCHOOL_INCOMPLETE" | "HIGH_SCHOOL_COMPLETE" | "TECHNICAL" | "UNIVERSITY_INCOMPLETE" | "UNIVERSITY_COMPLETE" | "POSTGRAD" | null;
    receivesBolsaFamilia: boolean;
    nis: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
}

export async function getPerson({ personId, slug }: GetPersonParams) {
  if (!personId) {
    return null;
  }

  const response = await api.get<GetPersonResponse | null>(`/organizations/${slug}/persons/${personId}`);
  return response.data;
}