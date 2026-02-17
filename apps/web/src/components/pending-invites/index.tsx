'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'


import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { getPendingInvites } from '@/api/get-pending-invites'
import { rejectInvite } from '@/api/reject-invite'
import { acceptInvite } from '@/api/accept-invite'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  const { mutateAsync: handleRejectInvite, isPending: isPendingRejectInvite } = useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }
  })
  const { mutateAsync: handleAcceptInvite, isPending: isPendingAcceptInvite } = useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    }
  })

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-muted-foreground text-sm">
          Pending invites ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-sm leading-relaxed">No pending invites.</p>
        )}

        {data?.invites.map((invite) => (
          <div className="space-y-2" key={invite.id}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="font-medium text-foreground">
                {invite.author?.name ?? 'Someone'}
              </span>{' '}
              invited you to join{' '}
              <span className="font-medium text-foreground">{invite.organization.name}</span>{' '}
              <span>{dayjs(invite.createdAt).fromNow()}</span>
            </p>

            <div className="flex gap-1">
              <Button onClick={() => handleAcceptInvite(invite.id)} disabled={isPendingAcceptInvite}>
                <Check className="mr-1.5 size-3" />
                Accept
              </Button>
              <Button
                className="text-muted-foreground"
                onClick={() => handleRejectInvite(invite.id)}
                variant="ghost"
                disabled={isPendingRejectInvite}
              >
                <X className="mr-1.5 size-3" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
