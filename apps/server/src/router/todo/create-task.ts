import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { authPlugin } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function createTask(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/tasks",
      {
        schema: {
          tags: ["tasks"],
          summary: "Create a task",
          body: z.object({
            text: z.string(),
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
          },
        },
      },
      async (request) => {
        const session = await request.session();
        const { text } = request.body;

        const task = await prisma.todo.create({
          data: {
            text,
            userId: session!.user.id,
          },
        });

        return { task };
      }
    );
}
