import { PersonStepProvider } from '@/app/providers/person-step-provider'
import OnboardingForm from '@/components/person/person-step'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/(private)/$slug/persons/new/')({
  component: RouteComponent,
  validateSearch: z.object({
    personId: z.string().optional(),
  }),
})

function RouteComponent() {
  return (
    <PersonStepProvider>
      <OnboardingForm />
    </PersonStepProvider>
  )
}
