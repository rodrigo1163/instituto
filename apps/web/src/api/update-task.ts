import { api } from "../lib/axios";

/**
 * Atualiza uma tarefa existente.
 *
 * @function updateTask
 * @param {string} id - O ID da tarefa a ser atualizada.
 * @param {Object} data - Dados para atualização da tarefa.
 * @param {string} [data.text] - O novo texto da tarefa (opcional).
 * @param {boolean} [data.completed] - O novo status de conclusão da tarefa (opcional).
 * @returns {Promise<void>} Retorna os dados da tarefa atualizada.
 * @throws {Error} Lança um erro se a atualização da tarefa falhar.
 */
export async function updateTask(
  id: string,
  data: { text?: string; completed?: boolean }
) {
  await api.put(`/tasks/${id}`, data);
}
