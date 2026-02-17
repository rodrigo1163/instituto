import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function getAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/address",
      {
        schema: {
          tags: ["address"],
          summary: "Get address of a person (excludes soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              address: z.object({
                id: z.string().uuid(),
                cep: z.string(),
                neighborhood: z.string(),
                street: z.string(),
                number: z.string(),
                complement: z.string().nullable(),
                personId: z.string().uuid(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }).nullable(),
            }),
          },
        },
      },
      async (request) => {
        const { personId } = request.params;

        const address = await prisma.address.findFirst({
          where: {
            personId,
            deleteAt: null,
          },
        });

        return { address };
      }
    );
}
