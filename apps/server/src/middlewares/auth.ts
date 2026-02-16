import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { UnauthorizedError } from "../router/_errors/unauthorized-error";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";

export const authPlugin = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request) => {
    request.session = async () => {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError("Não autorizado.");
        }

        return session;
      } catch (error) {
        throw new UnauthorizedError("Não autorizado.");
      }
    };
  });
});
