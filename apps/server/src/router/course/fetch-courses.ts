import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";

export async function fetchCourses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/courses",
      {
        schema: {
          tags: ["course"],
          summary: "List all courses (excluding soft-deleted)",
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              courses: z.array(
                z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                  description: z.string().nullable(),
                })
              ),
            }),
            401: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        await request.getUserMembership(request.params.slug);

        const courses = await prisma.course.findMany({
          where: { deleteAt: null },
          select: { id: true, title: true, description: true },
        });

        return { courses };
      }
    );
}
