import { api } from "../lib/axios";

/**
 * Deleta uma tarefa pelo ID.
 *
 * @function deleteTask
 * @param {string} id - O ID da tarefa a ser deletada.
 * @returns {Promise<void>} Retorna os dados da resposta da API.
 * @throws {Error} Lança um erro se a deleção da tarefa falhar.
 */

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}
