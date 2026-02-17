import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request-error";
import { NotFoundError } from "../_errors/not-found-error";

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

export async function createPerson(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons",
      {
        schema: {
          tags: ["person"],
          summary: "Create a person in the organization",
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            fullName: z.string(),
            cpf: z.string(),
            birthDate: z.coerce.date(),
            phoneNumber: z.string().optional(),
            fatherName: z.string().optional(),
            motherName: z.string().optional(),
            educationLevel: educationLevelSchema.optional(),
            receivesBolsaFamilia: z.boolean().default(false),
            nis: z.string().optional(),
          }),
          response: {
            200: z.null(),
            401: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const { organization } = await request.getUserMembership(slug);
        const body = request.body;

        const personExist = await prisma.person.findFirst({
          where: {
            organizationId: organization.id,
            cpf: body.cpf
          },
        });

        if (personExist) {
          throw new NotFoundError("Pessoa já cadastrada.");
        }

        await prisma.person.create({
          data: {
            organizationId: organization.id,
            fullName: body.fullName,
            cpf: body.cpf,
            birthDate: body.birthDate,
            phoneNumber: body.phoneNumber ?? null,
            fatherName: body.fatherName ?? null,
            motherName: body.motherName ?? null,
            educationLevel: body.educationLevel ?? null,
            receivesBolsaFamilia: body.receivesBolsaFamilia ?? false,
            nis: body.nis ?? null,
          }
        });
      }
    );
}
