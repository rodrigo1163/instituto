import { authClient } from "../../lib/auth-client";

export function useGetSession() {
  const session = authClient.useSession();
  return session;
}
