import { fakerPT_BR as faker } from "@faker-js/faker";
import { api } from "@/lib/axios";

export type Person = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  phoneNumber: string | null;
  fatherName: string | null;
  motherName: string | null;
  organizationId: string;
  educationLevel: string | null;
  receivesBolsaFamilia: boolean;
  nis: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FetchPersonsResponse = {
  persons: Person[];
};

export type FetchPersonsFilters = {
  search?: string;
};

const PAGE_SIZE = 15;

export interface FetchPersonsParams {
  slug: string;
  search?: string;
}

const EDUCATION_LEVELS = [
  "Fundamental Incompleto",
  "Fundamental Completo",
  "Médio Incompleto",
  "Médio Completo",
  "Superior Incompleto",
  "Superior Completo",
  "Pós-graduação",
] as const;

function formatCpf(numbers: string): string {
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function createMockPerson(organizationId: string): Person {
  const createdAt = faker.date.past({ years: 2 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  return {
    id: faker.string.uuid(),
    fullName: faker.person.fullName(),
    cpf: formatCpf(faker.string.numeric(11)),
    birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }).toISOString().split("T")[0],
    phoneNumber: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.85 }) ?? null,
    fatherName: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.7 }) ?? null,
    motherName: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.9 }) ?? null,
    organizationId,
    educationLevel: faker.helpers.maybe(() => faker.helpers.arrayElement(EDUCATION_LEVELS), { probability: 0.8 }) ?? null,
    receivesBolsaFamilia: faker.datatype.boolean({ probability: 0.3 }),
    nis: faker.helpers.maybe(() => faker.string.numeric(11), { probability: 0.4 }) ?? null,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

const MOCK_PERSONS_KEY = "__mock_persons_cache__";

function getOrCreateMockPersons(organizationId: string, count = 10): Person[] {
  const key = `${MOCK_PERSONS_KEY}_${organizationId}`;
  const cached = sessionStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as Person[];
    } catch {
      sessionStorage.removeItem(key);
    }
  }
  const persons = Array.from({ length: count }, () => createMockPerson(organizationId));
  sessionStorage.setItem(key, JSON.stringify(persons));
  return persons;
}

export async function fetchPersons(
  { slug, search }: FetchPersonsParams
): Promise<FetchPersonsResponse> {
  const useMock = true;

  if (useMock) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    let persons = getOrCreateMockPersons(slug, PAGE_SIZE);
    if (search?.trim()) {
      const term = search.trim().toLowerCase();
      persons = persons.filter((p) => p.fullName.toLowerCase().includes(term));
    }
    return { persons: persons.slice(0, PAGE_SIZE) };
  }

  const searchParams = new URLSearchParams();
  if (search?.trim()) searchParams.set("search", search.trim());

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const url = `/organizations/${slug}/persons${queryString}`;

  const response = await api.get<FetchPersonsResponse>(url);
  return response.data;
}
