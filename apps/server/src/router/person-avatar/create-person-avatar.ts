import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";

const documentTypeSchema = z.enum(["WALLET_PHOTO", "OTHER"]);

export async function createPersonAvatar(app: FastifyInstance) {
  // TODO: Implementar upload de foto/avatar (ex: S3, Cloudflare R2). Após o upload,
  // obter a URL do arquivo e enviá-la no body (fileUrl). No futuro este endpoint
  // pode aceitar multipart/form-data com o arquivo e fazer o upload antes de persistir.
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/avatar",
      {
        schema: {
          tags: ["person-avatar"],
          summary: "Create a avatar (e.g. photo) for a person. TODO: upload de foto futuramente.",
          params: z.object({
            slug: z.string(),
            personId: z.string().uuid(),
          }),
          body: z.object({
            type: documentTypeSchema.default("WALLET_PHOTO"),
            fileUrl: z.string().url(),
            fileName: z.string().optional(),
            mimeType: z.string().optional(),
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

        await prisma.personDocument.create({
          data: {
            personId,
            type: body.type,
            fileUrl: body.fileUrl,
            fileName: body.fileName ?? null,
            mimeType: body.mimeType ?? null,
          },
        });
      }
    );
}
