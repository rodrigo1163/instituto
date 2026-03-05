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
            receivedAt: z.string().optional(),
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

        const updateData: {
          receivedAt?: Date;
          quantity?: number | null;
          valueCents?: number | null;
          notes?: string | null;
        } = {};

        if (body.receivedAt !== undefined) {
          updateData.receivedAt = new Date(body.receivedAt);
        }
        if (body.quantity !== undefined) updateData.quantity = body.quantity;
        if (body.valueCents !== undefined) updateData.valueCents = body.valueCents;
        if (body.notes !== undefined) updateData.notes = body.notes;

        await prisma.personAssistance.update({
          where: { id: assistanceId },
          data: updateData,
        });

        return null;
      }
    );
}
