import { api } from "@/lib/axios"

export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"

interface GetPendingInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function getPendingInvites() {
  const response = await api.get<GetPendingInvitesResponse>('pending-invites')
  return response.data
}
