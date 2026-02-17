import { api } from "@/lib/axios";

interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export async function createOrganization(data: CreateOrganizationInput) {
  await api.post("/organizations", data);
}