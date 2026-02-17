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

const relativeSchema = z.object({
  id: z.string().uuid(),
  personId: z.string().uuid(),
  relativeName: z.string(),
  degree: kinshipDegreeSchema,
  degreeText: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function fetchRelatives(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/relatives",
      {
        schema: {
          tags: ["relative"],
          summary: "List relatives of a person (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              relatives: z.array(relativeSchema),
            }).nullable(),
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

        const relatives = await prisma.personRelative.findMany({
          where: {
            personId,
            deleteAt: null,
          },
          orderBy: { relativeName: "asc" },
        });

        return { relatives };
      }
    );
}
