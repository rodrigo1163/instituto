import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";

export async function fetchAssistanceTypes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/assistance-types",
      {
        schema: {
          tags: ["assistance-type"],
          summary: "List all assistance types (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              assistanceTypes: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
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
        await request.getUserMembership(request.params.slug);

        const assistanceTypes = await prisma.assistanceType.findMany({
          where: { deleteAt: null },
          select: { id: true, name: true, description: true },
        });

        return { assistanceTypes };
      }
    );
}
