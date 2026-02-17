import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { authPlugin } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'

export function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .delete(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Revoke a invite by id',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params
        const session = await request.session()
        const userId = session!.user.id
        const { organization, membership } = await request.getUserMembership(slug)

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found.')
        }

        await prisma.invite.delete({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
