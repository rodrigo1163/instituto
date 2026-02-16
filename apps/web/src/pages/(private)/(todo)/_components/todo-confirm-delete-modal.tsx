import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/delete-task";
import type { GetTasksResponse, Todo } from "@/api/get-tasks";

interface TaskConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToDelete: Todo | null;
}

export function TodoConfirmDeleteModal({
  open,
  onOpenChange,
  taskToDelete,
}: TaskConfirmDeleteModalProps) {
  const queryClient = useQueryClient();
  const taskText = taskToDelete?.text || "";
  const taskId = taskToDelete?.id || "";

  const { mutateAsync: deleteTaskFn, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await deleteTask(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<GetTasksResponse>(["tasks"], (oldData) => {
        if (!oldData) return oldData;
        const tasksWitoutRemoveId = oldData.tasks.filter((task) => task.id !== id)
        return {
          tasks: tasksWitoutRemoveId,
        };
      });
      onOpenChange(false);
    },
  });

  async function handleConfirm() {
    await deleteTaskFn(taskId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a tarefa "{taskText}"? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
