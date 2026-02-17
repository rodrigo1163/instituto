import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const assistanceSchema = z.object({
  id: z.string().uuid(),
  personId: z.string().uuid(),
  assistanceTypeId: z.string().uuid(),
  receivedAt: z.date(),
  quantity: z.number().int().nullable(),
  valueCents: z.number().int().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function fetchAssistances(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/assistances",
      {
        schema: {
          tags: ["assistance"],
          summary: "List assistances of a person (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              assistances: z.array(assistanceSchema),
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
        const { slug, personId } = request.params;
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

        const assistances = await prisma.personAssistance.findMany({
          where: {
            personId,
            deleteAt: null,
          },
          orderBy: { receivedAt: "desc" },
        });

        return { assistances };
      }
    );
}
