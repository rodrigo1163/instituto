import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'


import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { authPlugin } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'

export const roleSchema = z.enum([
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER"
]);

export function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invites',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { email, role } = request.body
        const session = await request.session()
        const { organization, membership } = await request.getUserMembership(slug)

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError('Another invite with same e-mail already exists.')
        }

        const memberWithSameEmail = await prisma.membership.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError('A member with same e-mail already belong to the organization.')
        }

        const invite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            email,
            role,
            authorId: session!.user.id,
          },
        })

        return reply.status(201).send({
          inviteId: invite.id,
        })
      }
    )
}
