import { api } from "@/lib/axios";

export interface PersonAvatar {
  id: string;
  personId: string;
  type: "WALLET_PHOTO" | "OTHER";
  fileUrl: string;
  fileName: string | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetPersonAvatarParams {
  personId: string | undefined;
  slug: string;
}

export interface GetPersonAvatarResponse {
  avatar: PersonAvatar | null;
}

export async function getPersonAvatar({
  personId,
  slug,
}: GetPersonAvatarParams): Promise<GetPersonAvatarResponse | null> {
  if (!personId) {
    return null;
  }

  const response = await api.get<GetPersonAvatarResponse>(
    `/organizations/${slug}/persons/${personId}/avatar`,
  );

  return response.data;
}
