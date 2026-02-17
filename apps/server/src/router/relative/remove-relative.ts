import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function removeRelative(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete(
      "/organizations/:slug/persons/:personId/relatives/:relativeId",
      {
        schema: {
          tags: ["relative"],
          summary: "Soft delete a relative",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            relativeId: z.string().uuid(),
          }),
          response: {
            200: z.null(),
            401: z.object({
              error: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const { slug, personId, relativeId } = request.params;
        const { organization } = await request.getUserMembership(slug);

        const person = await prisma.person.findFirst({
          where: {
            id: personId,
            organizationId: organization.id,
            deleteAt: null,
          },
        });

        if (!person) {
          throw new NotFoundError("Pessoa não encontrada.");
        }

        const relative = await prisma.personRelative.findFirst({
          where: {
            id: relativeId,
            personId,
            deleteAt: null,
          },
        });

        if (!relative) {
          throw new NotFoundError("Parente não encontrado.");
        }

        await prisma.personRelative.update({
          where: { id: relativeId },
          data: { deleteAt: new Date() },
        });
      }
    );
}
