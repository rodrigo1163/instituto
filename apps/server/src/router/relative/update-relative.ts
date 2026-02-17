import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const kinshipDegreeSchema = z.enum([
  "SPOUSE",
  "CHILD",
  "FATHER",
  "MOTHER",
  "SIBLING",
  "GRANDPARENT",
  "GRANDCHILD",
  "UNCLE_AUNT",
  "NEPHEW_NIECE",
  "COUSIN",
  "OTHER",
]);

export async function updateRelative(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId/relatives/:relativeId",
      {
        schema: {
          tags: ["relative"],
          summary: "Update a relative",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            relativeId: z.string().uuid(),
          }),
          body: z.object({
            relativeName: z.string().optional(),
            degree: kinshipDegreeSchema.optional(),
            degreeText: z.string().nullable().optional(),
            phoneNumber: z.string().nullable().optional(),
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
          data: body,
        });
      }
    );
}
