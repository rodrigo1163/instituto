import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";

const educationLevelSchema = z.enum([
  "NONE",
  "ELEMENTARY_INCOMPLETE",
  "ELEMENTARY_COMPLETE",
  "HIGH_SCHOOL_INCOMPLETE",
  "HIGH_SCHOOL_COMPLETE",
  "TECHNICAL",
  "UNIVERSITY_INCOMPLETE",
  "UNIVERSITY_COMPLETE",
  "POSTGRAD",
]);

const personSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  cpf: z.string(),
  birthDate: z.date(),
  phoneNumber: z.string().nullable(),
  fatherName: z.string().nullable(),
  motherName: z.string().nullable(),
  organizationId: z.string().uuid(),
  educationLevel: educationLevelSchema.nullable(),
  receivesBolsaFamilia: z.boolean(),
  nis: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function fetchPersons(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons",
      {
        schema: {
          tags: ["person"],
          summary: "List persons of the organization (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              persons: z.array(personSchema),
            }),
            401: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const { organization } = await request.getUserMembership(slug);

        const persons = await prisma.person.findMany({
          where: {
            organizationId: organization.id,
            deleteAt: null,
          },
          orderBy: { fullName: "asc" },
        });

        return { persons };
      }
    );
}
