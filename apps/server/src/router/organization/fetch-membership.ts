import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request-error"
import type { MembershipRole } from '../../../generated/prisma/enums'

const roleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'])

export async function fetchMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/membership",
      {
        schema: {
          tags: ["organization"],
          summary: "Get details organization for the authenticated user",
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.uuidv4(),
                role: roleSchema,
                userId: z.uuidv4(),
                organizationId: z.uuidv4(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)


        return { membership };
      }
    );
}

