import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function TodoSkeleton() {
  return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">To-Do List</CardTitle>
              <CardDescription>
                Organize suas tarefas e mantenha-se produtivo
              </CardDescription>
            </CardHeader>
  
            <CardContent className="space-y-6">
              {/* Input Section (com título real + input e button desabilitados) */}
              <div className="flex gap-2">
                <Input
                  disabled
                  placeholder="Adicione uma nova tarefa..."
                  className="flex-1 opacity-60"
                />
                <Button disabled size="default" className="opacity-60">
                <Plus className="size-4" />
                  Adicionar
                </Button>
              </div>
  
              {/* Filter Buttons Skeleton */}
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" disabled variant="outline" className="pointer-events-none">
                  <Skeleton className="h-4 w-20" />
                </Button>
                <Button size="sm" disabled variant="outline" className="pointer-events-none">
                  <Skeleton className="h-4 w-24" />
                </Button>
                <Button size="sm" disabled variant="outline" className="pointer-events-none">
                  <Skeleton className="h-4 w-28" />
                </Button>
              </div>
  
              {/* Todo List Skeleton */}
              <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* checkbox (círculo) */}
                  <Skeleton className="h-5 w-5 rounded-full" />

                  {/* texto da tarefa */}
                  <Skeleton className="h-4 w-full max-w-sm" />

                  {/* botão de deletar (fantasma) */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled
                    className="opacity-60"
                  >
                    <Skeleton className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
  
              {/* Stats Skeleton */}
              <div className="pt-4 border-t text-center">
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
