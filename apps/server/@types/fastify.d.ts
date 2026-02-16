import "fastify";
import type { Organization, Membership } from '@prisma/client'

export interface Session {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined | undefined;
    userAgent?: string | null | undefined | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined | undefined;
  };
}

declare module "fastify" {
  interface FastifyRequest {
    session: () => Promise<Session | null>;
    getUserMembership: (slug: string) => Promise<{
      organization: Organization,
      membership: Membership
    }>
  }
}
