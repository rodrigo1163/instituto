import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";

export async function getTasks(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/tasks",
      {
        schema: {
          tags: ["tasks"],
          summary: "Get all tasks for the authenticated user",
          response: {
            200: z.object({
              tasks: z.array(
                z.object({
                  text: z.string(),
                  id: z.string(),
                  completed: z.boolean(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  userId: z.string(),
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
        const session = await request.session();

        const tasks = await prisma.todo.findMany({
          where: {
            userId: session!.user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return { tasks };
      }
    );
}

