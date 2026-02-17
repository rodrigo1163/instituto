import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function updateAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId/address",
      {
        schema: {
          tags: ["address"],
          summary: "Update address of a person",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            cep: z.string().optional(),
            neighborhood: z.string().optional(),
            street: z.string().optional(),
            number: z.string().optional(),
            complement: z.string().nullable().optional(),
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

        const address = await prisma.address.findFirst({
          where: {
            personId,
            deleteAt: null,
          },
        });

        if (!address) {
          throw new NotFoundError("Endereço não encontrado.");
        }

        await prisma.address.update({
          where: { id: address.id },
          data: body,
        });
      }
    );
}
