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

        const cpfMudou = body.cpf && body.cpf !== personExist.cpf;
        const nisMudou = body.nis && body.nis !== personExist.nis;

        if (cpfMudou || nisMudou) {
          const orConditions: Array<{ cpf: string } | { nis: string }> = [];

          if (cpfMudou) {
            orConditions.push({ cpf: body.cpf! });
          }

          if (nisMudou) {
            orConditions.push({ nis: body.nis! });
          }

          const cpfOrNisExist = await prisma.person.findFirst({
            where: {
              organizationId: organization.id,
              NOT: { id: personId },
              OR: orConditions,
            },
          });

          if (cpfOrNisExist) {
            const duplicateCpf = cpfMudou && cpfOrNisExist.cpf === body.cpf;
            const duplicateNis = nisMudou && cpfOrNisExist.nis === body.nis;

            if (duplicateCpf && duplicateNis) {
              throw new BadRequestError("CPF e NIS já estão cadastrados");
            }
            if (duplicateCpf) {
              throw new BadRequestError("CPF já cadastrado");
            }
            if (duplicateNis) {
              throw new BadRequestError("NIS já cadastrado");
            }
          }
        }

        await prisma.person.update({
          where: { id: personId },
          data: body,
        });
      },
    );
}
