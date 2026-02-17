
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'



import { UnauthorizedError } from '../_errors/unauthorized-error'
import { authPlugin } from '../../middlewares/auth'
import { roleSchema } from './create-invite'
import { prisma } from '../../../lib/prisma'

export function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get all organization invites',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.uuid(),
                  role: roleSchema,
                  email: z.email(),
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const session = await request.session()
        const userId = session!.user.id
        const { organization, membership } = await request.getUserMembership(slug)

        const invites = await prisma.invite.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { invites }
      }
    )
}
