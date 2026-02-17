import { api } from "@/lib/axios";

interface Organization {
  organizations: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }[]
}

export async function fetchOrganizations() {
  const response = await api.get<Organization>('/organizations');
  return response.data;
  
}