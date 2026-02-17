import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

export async function getEnrollment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/enrollments/:enrollmentId",
      {
        schema: {
          tags: ["enrollment"],
          summary: "Get an enrollment by id (excludes soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            enrollmentId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              enrollment: z.object({
                id: z.string().uuid(),
                personId: z.string().uuid(),
                courseId: z.string().uuid(),
                enrolledAt: z.date(),
                completedAt: z.date().nullable(),
                notes: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }).nullable(),
            }),
          },
        },
      },
      async (request) => {
        const { slug, personId, enrollmentId } = request.params;
        const { organization } = await request.getUserMembership(slug);

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

        return { enrollment };
      }
    );
}
