import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";
import { BadRequestError } from "../_errors/bad-request-error";

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
            receivedAt: z.string().optional(),
            quantity: z.coerce.number().int().optional(),
            valueCents: z.coerce.number().int().optional(),
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
            400: z.object({
              message: z.string(),
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

        const existingAssistance = await prisma.personAssistance.findFirst({
          where: {
            personId,
            assistanceTypeId: body.assistanceTypeId,
          },
        });
        if(existingAssistance?.deleteAt) {
          await prisma.personAssistance.update({
            where: { id: existingAssistance.id },
            data: { deleteAt: null },
          });
          return null;
        }

        if (existingAssistance) {
          throw new BadRequestError(
            "Pessoa já possui este auxílio cadastrado.",
          );
        }

        const receivedAt = body.receivedAt
          ? new Date(body.receivedAt)
          : new Date();

        await prisma.personAssistance.create({
          data: {
            personId,
            assistanceTypeId: body.assistanceTypeId,
            receivedAt,
            quantity: body.quantity ?? null,
            valueCents: body.valueCents ?? null,
            notes: body.notes ?? null,
          },
        });

        return null;
      }
    );
}
