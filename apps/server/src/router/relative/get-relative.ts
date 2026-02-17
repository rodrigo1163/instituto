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

export async function getRelative(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/relatives/:relativeId",
      {
        schema: {
          tags: ["relative"],
          summary: "Get a relative by id (excludes soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            relativeId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              relative: z.object({
                id: z.string().uuid(),
                personId: z.string().uuid(),
                relativeName: z.string(),
                degree: kinshipDegreeSchema,
                degreeText: z.string().nullable(),
                phoneNumber: z.string().nullable(),
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

        return { relative };
      }
    );
}
