import { api } from "@/lib/axios";

export interface CreatePersonAvatarInput {
  type?: "WALLET_PHOTO" | "OTHER";
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
}

export async function createPersonAvatar({
  slug,
  personId,
  body,
}: {
  slug: string;
  personId: string;
  body: CreatePersonAvatarInput;
}): Promise<void> {
  await api.post(
    `/organizations/${slug}/persons/${personId}/avatar`,
    body,
  );
}
