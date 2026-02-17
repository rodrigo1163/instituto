import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '../../../lib/prisma'
import { authPlugin } from '../../middlewares/auth'

export function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['invites'],
          summary: 'Accept a invite by id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const session = await request.session()
        const { inviteId } = request.params

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found or expired.')
        }

        const user = await prisma.user.findUnique({
          where: {
            id: session!.user.id,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('This invite belongs to another user.')
        }

        await prisma.$transaction([
          prisma.membership.create({
            data: {
              userId: session!.user.id,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          }),

          prisma.invite.delete({
            where: {
              id: inviteId,
            },
          }),
        ])

        return reply.status(204).send()
      }
    )
}
