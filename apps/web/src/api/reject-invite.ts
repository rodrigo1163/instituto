import { api } from "@/lib/axios";

export async function rejectInvite(inviteId: string) {
  await api.post(`invites/${inviteId}/reject`)
}
