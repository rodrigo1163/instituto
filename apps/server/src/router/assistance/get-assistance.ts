import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function getAssistance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/assistances/:assistanceId",
      {
        schema: {
          tags: ["assistance"],
          summary: "Get an assistance by id (excludes soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            assistanceId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              assistance: z.object({
                id: z.string().uuid(),
                personId: z.string().uuid(),
                assistanceTypeId: z.string().uuid(),
                receivedAt: z.date(),
                quantity: z.number().int().nullable(),
                valueCents: z.number().int().nullable(),
                notes: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }).nullable(),
            }),
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
        const { slug, personId, assistanceId } = request.params;
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

        const assistance = await prisma.personAssistance.findFirst({
          where: {
            id: assistanceId,
            personId,
            deleteAt: null,
          },
        });

        return { assistance };
      }
    );
}
