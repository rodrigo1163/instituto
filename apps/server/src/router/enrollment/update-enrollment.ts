import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function updateEnrollment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId/enrollments/:enrollmentId",
      {
        schema: {
          tags: ["enrollment"],
          summary: "Update an enrollment",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            enrollmentId: z.string().uuid(),
          }),
          body: z.object({
            completedAt: z.coerce.date().nullable().optional(),
            notes: z.string().nullable().optional(),
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
        const { slug, personId, enrollmentId } = request.params;
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

        const enrollment = await prisma.personCourse.findFirst({
          where: {
            id: enrollmentId,
            personId,
            deleteAt: null,
          },
        });

        if (!enrollment) {
          throw new NotFoundError("Matrícula não encontrada.");
        }

        await prisma.personCourse.update({
          where: { id: enrollmentId },
          data: body,
        });
      }
    );
}
