import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/address",
      {
        schema: {
          tags: ["address"],
          summary: "Create address for a person",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            cep: z.string(),
            neighborhood: z.string(),
            street: z.string(),
            number: z.string(),
            complement: z.string().optional(),
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

        const existingAddress = await prisma.address.findFirst({
          where: {
            personId,
            deleteAt: null,
          },
        });

        if (existingAddress) {
          throw new BadRequestError("Esta pessoa já possui um endereço cadastrado.");
        }

        await prisma.address.create({
          data: {
            personId,
            cep: body.cep,
            neighborhood: body.neighborhood,
            street: body.street,
            number: body.number,
            complement: body.complement ?? null,
          },
        });
      }
    );
}
