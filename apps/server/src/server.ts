import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "../env";
import { auth } from "../lib/auth";
import fastifyCors from "@fastify/cors";
import { createTask } from "./router/todo/create-task";
import { getTasks } from "./router/todo/get-tasks";
import { updateTask } from "./router/todo/update-task";
import { deleteTask } from "./router/todo/delete-task";
import { createOrganization } from "./router/organization/create-organization";
import { fetchOrganizations } from "./router/organization/fetch-organizations";
import { createPerson } from "./router/person/create-person";
import { fetchPersons } from "./router/person/fetch-persons";
import { BadRequestError } from "./router/_errors/bad-request-error";
import { UnauthorizedError } from "./router/_errors/unauthorized-error";
import { NotFoundError } from "./router/_errors/not-found-error";
import { getPerson } from "./router/person/get-person";
import { updatePerson } from "./router/person/update-person";
import { removePerson } from "./router/person/remove-person";
import { getAddress } from "./router/address/get-address";
import { createAddress } from "./router/address/create-address";
import { updateAddress } from "./router/address/update-address";
import { removeAddress } from "./router/address/remove-address";
import { fetchRelatives } from "./router/relative/fetch-relatives";
import { getRelative } from "./router/relative/get-relative";
import { createRelative } from "./router/relative/create-relative";
import { updateRelative } from "./router/relative/update-relative";
import { removeRelative } from "./router/relative/remove-relative";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof BadRequestError) {
    return reply.status(400).send({ error: error.message });
  }
  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ error: error.message });
  }
  if (error instanceof NotFoundError) {
    return reply.status(404).send({ error: error.message });
  }
  throw error;
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

app.get("/health", () => {
  return "ok";
});

app.register(createTask);
app.register(getTasks);
app.register(updateTask);
app.register(deleteTask);
app.register(createOrganization);
app.register(fetchOrganizations);
app.register(createPerson);
app.register(fetchPersons);
app.register(getPerson);
app.register(updatePerson);
app.register(removePerson);
app.register(getAddress);
app.register(createAddress);
app.register(updateAddress);
app.register(removeAddress);
app.register(fetchRelatives);
app.register(getRelative);
app.register(createRelative);
app.register(updateRelative);
app.register(removeRelative);

app.route({
  method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });
      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      // Process authentication request
      const response = await auth.handler(req);
      // Forward response to client
      reply.status(response.status);
      // biome-ignore lint/suspicious/useIterableCallbackReturn: because it's a callback
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch {
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
