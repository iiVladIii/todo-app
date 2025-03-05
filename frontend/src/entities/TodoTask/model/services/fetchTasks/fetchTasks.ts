import { $api } from '@/shared/api/api';
import { TodoTask } from '../../types/TodoTask';

export const fetchTasks = async (listId: number) => {
    return await $api.get<TodoTask[]>(`/todos/${listId}/tasks`);
};
