import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Todo, UpdateTaskInput } from "@/api/get-tasks";

type Filter = "all" | "active" | "completed";

interface TodoListProps {
  todos: Todo[];
  filteredTodos: Todo[];
  error: Error | null;
  filter: Filter;
  onToggleComplete: (input: UpdateTaskInput) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoList({
  todos,
  filteredTodos,
  error,
  filter,
  onToggleComplete,
  onDelete,
}: TodoListProps) {
  return (
    <div className="space-y-2">
      {error ? (
        <div className="text-center py-12 text-destructive">
          <p className="text-lg">Erro ao carregar tarefas: {error.message}</p>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">
            {todos.length === 0
              ? "Nenhuma tarefa ainda. Adicione uma para começar!"
              : filter === "active"
              ? "Nenhuma tarefa ativa!"
              : filter === "completed"
              ? "Nenhuma tarefa completada ainda!"
              : "Nenhuma tarefa encontrada."}
          </p>
        </div>
      ) : (
        filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
          >
            <button
              type="button"
              onClick={() =>
                onToggleComplete({
                  id: todo.id,
                  data: { completed: !todo.completed },
                })
              }
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label={
                todo.completed
                  ? "Marcar como não completa"
                  : "Marcar como completa"
              }
            >
              {todo.completed ? (
                <CheckCircle2 className="size-5 text-primary" />
              ) : (
                <Circle className="size-5" />
              )}
            </button>
            <span
              className={`flex-1 text-base ${
                todo.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {todo.text}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(todo)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Deletar tarefa"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
