import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const documentTypeSchema = z.enum(["WALLET_PHOTO", "OTHER"]);

export async function updateDocument(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .put(
      "/organizations/:slug/persons/:personId/documents/:documentId",
      {
        schema: {
          tags: ["document"],
          summary: "Update a document (e.g. avatar)",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
            documentId: z.string().uuid(),
          }),
          body: z.object({
            type: documentTypeSchema.optional(),
            fileUrl: z.string().url().optional(),
            fileName: z.string().nullable().optional(),
            mimeType: z.string().nullable().optional(),
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
        const { slug, personId, documentId } = request.params;
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

        const document = await prisma.personDocument.findFirst({
          where: {
            id: documentId,
            personId,
            deleteAt: null,
          },
        });

        if (!document) {
          throw new NotFoundError("Documento não encontrado.");
        }

        await prisma.personDocument.update({
          where: { id: documentId },
          data: body,
        });
      }
    );
}
