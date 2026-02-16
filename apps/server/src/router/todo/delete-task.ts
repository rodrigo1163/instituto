import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function deleteTask(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete(
      "/tasks/:id",
      {
        schema: {
          tags: ["tasks"],
          summary: "Delete a task",
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              message: z.string(),
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

        const task = await prisma.todo.findUnique({
          where: { id },
        });

        if (!task) {
          return reply.code(404).send({ error: "Task not found" });
        }

        if (task.userId !== session!.user.id) {
          throw new UnauthorizedError("Unauthorized");
        }

        await prisma.todo.delete({
          where: { id },
        });

        return { message: "Task deleted successfully" };
      }
    );
}

