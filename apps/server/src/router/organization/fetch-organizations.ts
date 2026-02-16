import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";

export async function fetchOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations",
      {
        schema: {
          tags: ["organizations"],
          summary: "Get all organizations for the authenticated user",
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string().nullable(),
                })
              ),
            }),
            401: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const session = await request.session();

        const memberships = await prisma.membership.findMany({
          where: {
            userId: session!.user.id,
          },
          include: {
            organization: true,
          },
        });

        const organizations = memberships.map((org) => ({
          id: org.organization.id,
          name: org.organization.name,
          slug: org.organization.slug,
          description: org.organization.description,
        }));

        return { organizations };
      }
    );
}

