import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function updateAssistance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId/assistances/:assistanceId",
      {
        schema: {
          tags: ["assistance"],
          summary: "Update an assistance record",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            assistanceId: z.string().uuid(),
          }),
          body: z.object({
            receivedAt: z.coerce.date().optional(),
            quantity: z.number().int().nullable().optional(),
            valueCents: z.number().int().nullable().optional(),
            notes: z.string().nullable().optional(),
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
        const { slug, personId, assistanceId } = request.params;
        const { organization } = await request.getUserMembership(slug);
        const body = request.body;

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

        if (!assistance) {
          throw new NotFoundError("Registro de assistência não encontrado.");
        }

        await prisma.personAssistance.update({
          where: { id: assistanceId },
          data: body,
        });
      }
    );
}
