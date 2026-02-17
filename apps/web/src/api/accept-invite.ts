import { api } from "@/lib/axios";

export async function acceptInvite(inviteId: string) {
  await api.post(`invites/${inviteId}/accept`)
}
