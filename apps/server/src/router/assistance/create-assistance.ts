import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function createAssistance(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/assistances",
      {
        schema: {
          tags: ["assistance"],
          summary: "Create an assistance record for a person",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            assistanceTypeId: z.string().uuid(),
            receivedAt: z.coerce.date().optional(),
            quantity: z.number().int().optional(),
            valueCents: z.number().int().optional(),
            notes: z.string().optional(),
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
        const { slug, personId } = request.params;
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

        const assistanceType = await prisma.assistanceType.findFirst({
          where: {
            id: body.assistanceTypeId,
            deleteAt: null,
          },
        });

        if (!assistanceType) {
          throw new NotFoundError("Tipo de assistência não encontrado.");
        }

        await prisma.personAssistance.create({
          data: {
            personId,
            assistanceTypeId: body.assistanceTypeId,
            receivedAt: body.receivedAt ?? new Date(),
            quantity: body.quantity ?? null,
            valueCents: body.valueCents ?? null,
            notes: body.notes ?? null,
          },
        });
      }
    );
}
