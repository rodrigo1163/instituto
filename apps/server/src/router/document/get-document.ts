import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const documentTypeSchema = z.enum(["WALLET_PHOTO", "OTHER"]);

export async function getDocument(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/documents/:documentId",
      {
        schema: {
          tags: ["document"],
          summary: "Get a document by id (excludes soft-deleted)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            documentId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              document: z.object({
                id: z.string().uuid(),
                personId: z.string().uuid(),
                type: documentTypeSchema,
                fileUrl: z.string(),
                fileName: z.string().nullable(),
                mimeType: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }).nullable(),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const { slug, personId, documentId } = request.params;
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

        const document = await prisma.personDocument.findFirst({
          where: {
            id: documentId,
            personId,
            deleteAt: null,
          },
        });

        return { document };
      }
    );
}
