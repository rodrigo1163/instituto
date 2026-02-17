import OnboardingForm from '@/components/person/person-step'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/$slug/persons/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <OnboardingForm />
}
