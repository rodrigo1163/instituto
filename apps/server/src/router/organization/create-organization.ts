import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { authPlugin } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations",
      {
        schema: {
          tags: ["organizations"],
          summary: "Create an organization",
          body: z.object({
            name: z.string(),
            slug: z.string(),
          }),
          response: {
            200: z.object({
              organization: z.object({
                id: z.string(),
              }),
            }),
            401: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const session = await request.session();
        const { name, slug } = request.body;

        const organizationExist = await prisma.organization.findUnique({
          where: {
            slug,
          }
        })

        if (organizationExist) {
          throw new BadRequestError('Essa organização já existe')
        }

        const organization = await prisma.$transaction(async (tx) => {
          const org = await tx.organization.create({
            data: {
              name,
              slug,
              createdById: session!.user.id,
            },
            select: {
              id: true,
            },
          });

          await tx.membership.create({
            data: {
              userId: session!.user.id,
              organizationId: org.id,
              role: "OWNER",
            },
          });

          return org;
        });

        return { organization };
      }
    );
}
