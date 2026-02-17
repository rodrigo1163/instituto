import { api } from "@/lib/axios";

export const EDUCATION_LEVELS = [
  "NONE",
  "ELEMENTARY_INCOMPLETE",
  "ELEMENTARY_COMPLETE",
  "HIGH_SCHOOL_INCOMPLETE",
  "HIGH_SCHOOL_COMPLETE",
  "TECHNICAL",
  "UNIVERSITY_INCOMPLETE",
  "UNIVERSITY_COMPLETE",
  "POSTGRAD",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export interface CreatePersonInput {
  fullName: string;
  cpf: string;
  birthDate: Date | string;
  phoneNumber?: string;
  fatherName?: string;
  motherName?: string;
  educationLevel?: EducationLevel;
  receivesBolsaFamilia?: boolean;
  nis?: string;
}

export interface CreatePersonResponse {
  id: string;
}

export async function createPerson({
  slug,
  body,
}: {
  slug: string;
  body: CreatePersonInput;
}): Promise<CreatePersonResponse> {
  const payload = {
    ...body,
    birthDate:
      typeof body.birthDate === "string"
        ? body.birthDate
        : body.birthDate.toISOString().split("T")[0],
  };
  const response = await api.post<CreatePersonResponse>(
    `/organizations/${slug}/persons`,
    payload
  );
  return response.data;
}
