import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const enrollmentSchema = z.object({
  id: z.string().uuid(),
  personId: z.string().uuid(),
  courseId: z.string().uuid(),
  enrolledAt: z.date(),
  completedAt: z.date().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function fetchEnrollments(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/enrollments",
      {
        schema: {
          tags: ["enrollment"],
          summary: "List enrollments of a person (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              enrollments: z.array(enrollmentSchema),
            }),
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

        const enrollments = await prisma.personCourse.findMany({
          where: {
            personId,
            deleteAt: null,
          },
          orderBy: { enrolledAt: "desc" },
        });

        return { enrollments };
      }
    );
}
