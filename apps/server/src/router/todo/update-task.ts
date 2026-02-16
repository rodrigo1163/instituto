import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function updateTask(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/tasks/:id",
      {
        schema: {
          tags: ["tasks"],
          summary: "Update a task",
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            text: z.string().optional(),
            completed: z.boolean().optional(),
          }),
          response: {
            200: z.object({
              task: z.object({
                text: z.string(),
                id: z.string(),
                completed: z.boolean(),
                createdAt: z.date(),
                updatedAt: z.date(),
                userId: z.string(),
              }),
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
      async (request, reply) => {
        const session = await request.session();
        const { id } = request.params;
        const { text, completed } = request.body;

        const task = await prisma.todo.findUnique({
          where: { id },
        });

        if (!task) {
          return reply.code(404).send({ error: "Task not found" });
        }

        if (task.userId !== session!.user.id) {
          throw new UnauthorizedError("Unauthorized");
        }

        const updatedTask = await prisma.todo.update({
          where: { id },
          data: {
            ...(text !== undefined && { text }),
            ...(completed !== undefined && { completed }),
          },
        });

        return { task: updatedTask };
      }
    );
}

