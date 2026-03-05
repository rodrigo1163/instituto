import { api } from "@/lib/axios";

export interface UpdatePersonAvatarInput {
  type?: "WALLET_PHOTO" | "OTHER";
  fileUrl?: string;
  fileName?: string | null;
  mimeType?: string | null;
}

export async function updatePersonAvatar({
  slug,
  personId,
  documentId,
  body,
}: {
  slug: string;
  personId: string;
  documentId: string;
  body: UpdatePersonAvatarInput;
}): Promise<void> {
  await api.put(
    `/organizations/${slug}/persons/${personId}/avatar/${documentId}`,
    body,
  );
}
