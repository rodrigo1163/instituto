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

/** Schema do payload JSON da resposta (datas como string ISO após serialização). */
const personSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  cpf: z.string(),
  birthDate: z.string().datetime(),
  phoneNumber: z.string().nullable(),
  fatherName: z.string().nullable(),
  motherName: z.string().nullable(),
  organizationId: z.string().uuid(),
  educationLevel: educationLevelSchema.nullable(),
  receivesBolsaFamilia: z.boolean(),
  nis: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const fetchPersonsQuerystringSchema = z.object({
  search: z.string().optional(),
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
          querystring: fetchPersonsQuerystringSchema,
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
        const query = fetchPersonsQuerystringSchema.safeParse(request.query);
        const filters = query.success ? query.data : {};
        const { organization } = await request.getUserMembership(slug);

        const where: Record<string, unknown> = {
          organizationId: organization.id,
          deleteAt: null,
        };

        const searchTerm = filters.search?.trim();
        if (searchTerm) {
          where.OR = [
            { fullName: { contains: searchTerm } },
            { cpf: { contains: searchTerm } },
            { phoneNumber: { contains: searchTerm } },
            { fatherName: { contains: searchTerm } },
            { motherName: { contains: searchTerm } },
          ];
        }

        const rows = await prisma.person.findMany({
          where,
          orderBy: { fullName: "asc" },
        });
        const persons = rows.map((p) => ({
          id: p.id,
          fullName: p.fullName,
          cpf: p.cpf,
          birthDate: p.birthDate.toISOString(),
          phoneNumber: p.phoneNumber,
          fatherName: p.fatherName,
          motherName: p.motherName,
          organizationId: p.organizationId,
          educationLevel: p.educationLevel,
          receivesBolsaFamilia: p.receivesBolsaFamilia,
          nis: p.nis,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }));

        return { persons };
      }
    );
}
