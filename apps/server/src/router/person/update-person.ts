import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";
import { BadRequestError } from "../_errors/bad-request-error";

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

export async function updatePerson(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId",
      {
        schema: {
          tags: ["person"],
          summary: "Update a person",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            fullName: z.string().optional(),
            cpf: z.string().optional(),
            birthDate: z.coerce.date().optional(),
            phoneNumber: z.string().nullable().optional(),
            fatherName: z.string().nullable().optional(),
            motherName: z.string().nullable().optional(),
            educationLevel: educationLevelSchema.nullable().optional(),
            receivesBolsaFamilia: z.boolean().optional(),
            nis: z.string().nullable().optional(),
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

        const personExist = await prisma.person.findFirst({
          where: {
            id: personId,
            organizationId: organization.id,
            deleteAt: null,
          },
        });

        if (!personExist) {
          throw new NotFoundError("Pessoa não encontrada.");
        }

        if (
          (body.cpf || body.nis) &&
          (body.cpf !== personExist.cpf || body.nis !== personExist.nis)
        ) {
          const cpfOrNisExist = await prisma.person.findFirst({
            where: {
              OR: [
                {
                  cpf: body.cpf,
                },
                {
                  nis: body.nis,
                },
              ],
            },
          });

          if (
            (cpfOrNisExist && cpfOrNisExist.cpf === body.cpf) ||
            cpfOrNisExist?.nis === body.nis
          ) {
            throw new BadRequestError("CPF e NIS já estão cadastrados");
          }
          if (cpfOrNisExist && cpfOrNisExist.cpf === body.cpf) {
            throw new BadRequestError("CPF já cadastrado");
          }
          throw new BadRequestError("Nis já cadastrado");
        }

        await prisma.person.update({
          where: { id: personId },
          data: body,
        });
      },
    );
}
