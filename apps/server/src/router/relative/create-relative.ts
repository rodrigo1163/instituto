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

export async function createRelative(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/relatives",
      {
        schema: {
          tags: ["relative"],
          summary: "Create a relative for a person",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            relativeName: z.string(),
            degree: kinshipDegreeSchema,
            degreeText: z.string().optional(),
            phoneNumber: z.string().optional(),
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

        await prisma.personRelative.create({
          data: {
            personId,
            relativeName: body.relativeName,
            degree: body.degree,
            degreeText: body.degreeText ?? null,
            phoneNumber: body.phoneNumber ?? null,
          },
        });
      }
    );
}
