import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createEnrollment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/enrollments",
      {
        schema: {
          tags: ["enrollment"],
          summary: "Enroll a person in a course",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            courseId: z.string().uuid(),
            notes: z.string().optional(),
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

        const course = await prisma.course.findFirst({
          where: {
            id: body.courseId,
            deleteAt: null,
          },
        });

        if (!course) {
          throw new NotFoundError("Curso não encontrado.");
        }

        const existing = await prisma.personCourse.findFirst({
          where: {
            personId,
            courseId: body.courseId,
            deleteAt: null,
          },
        });

        if (existing) {
          throw new BadRequestError("Pessoa já matriculada neste curso.");
        }

        await prisma.personCourse.create({
          data: {
            personId,
            courseId: body.courseId,
            notes: body.notes ?? null,
          },
        });
      }
    );
}
