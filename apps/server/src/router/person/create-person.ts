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
            id: z.string().uuid().optional(),
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
            200: z.object({ id: z.string().uuid() }),
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

        const orConditions: Array<{ cpf: string } | { nis: string }> = [
          { cpf: body.cpf },
        ];

        if (body.nis) {
          orConditions.push({ nis: body.nis });
        }

        const personExist = await prisma.person.findFirst({
          where: {
            organizationId: organization.id,
            NOT: { id: body.id },
            OR: orConditions,
          },
        });

        if (personExist) {
          const duplicateCpf = personExist.cpf === body.cpf;
          const duplicateNis = body.nis && personExist.nis === body.nis;

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

        const data = {
            id: body.id,
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

        if (body.id) {
          const person = await prisma.person.update({
            where: { id: body.id },
            data,
            select: {
              id: true
            }
          });
          return { id: person.id };
        }

        const person = await prisma.person.create({
          data,
          select: {
            id: true
          }
        });

        return { id: person.id };
      },
    );
}
