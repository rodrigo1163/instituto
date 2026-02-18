import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function createAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/address",
      {
        schema: {
          tags: ["address"],
          summary: "Create or update address for a person",
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
            200: z.object({ id: z.string().uuid() }),
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

        const data = {
          cep: body.cep,
          neighborhood: body.neighborhood,
          street: body.street,
          number: body.number,
          complement: body.complement ?? null,
        };

        if (existingAddress) {
          const address = await prisma.address.update({
            where: { id: existingAddress.id },
            data,
            select: {
              id: true,
            },
          });
          return { id: address.id };
        }

        const address = await prisma.address.create({
          data: {
            personId,
            ...data,
          },
          select: {
            id: true,
          },
        });

        return { id: address.id };
      },
    );
}
