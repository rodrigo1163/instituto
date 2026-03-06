import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../../lib/prisma";
import { authPlugin } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found-error";
import { BadRequestError } from "../_errors/bad-request-error";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from '../../../lib/cloudflare';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../../env";
import { randomUUID } from "node:crypto";

export async function photoCardUpload(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      "/organizations/:slug/persons/:personId/photo-card-upload",
      {
        schema: {
          tags: ["uploads"],
          summary: "Upload a photo card for a person using presigned URL",
          params: z.object({
            slug: z.string(),
            personId: z.uuid(),
          }),
          body: z.object({
            name: z.string().min(1),
            contentType: z.string().regex(/\w+\/[-+.\w]+/),
          }),
          response: {
            200: z.object({
              signedUrl: z.string(),
              fileId: z.cuid(),
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
      async (request) => { 
        const { slug, personId } = request.params;
        const { organization } = await request.getUserMembership(slug);
        const { name, contentType } = request.body;

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

        const fileKey = randomUUID().concat('-').concat(name);

        const signedUrl = await getSignedUrl(
          r2,
          new PutObjectCommand({
            Bucket: 'instituto-dev',
            Key: fileKey,
            ContentType: contentType,
          }),
          {
            expiresIn: 600, // 10 minutes
          }
        )

        const file =await prisma.file.create({
          data: {
            name,
            key: fileKey,
            contentType,
            personId: person.id,
          },
        })

        return {
          signedUrl,
          fileId: file.id,
        }
      }
    );
}
export async function getPhotoCardUpload(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/organizations/:slug/persons/:personId/file/:id",
      {
        schema: {
          tags: ["uploads"],
          summary: "Get a file by id",
          params: z.object({
            slug: z.string(),
            personId: z.uuid(),
            id: z.cuid(),
          }),
          response: {
            200: z.object({
              signedUrl: z.string(),
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
      async (request) => { 
        const { slug, personId, id } = request.params;
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

        const file = await prisma.file.findUnique({
          where: {
            id,
          }
        })

         const signedUrl = await getSignedUrl(
          r2,
          new GetObjectCommand({
            Bucket: 'instituto-dev',
            Key: file?.key,
          }),
          {
            expiresIn: 600, // 10 minutes
          }
        )

        
        return {
          signedUrl,
        }
      }
    );
}


