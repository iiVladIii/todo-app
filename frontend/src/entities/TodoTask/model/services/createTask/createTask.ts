import { $api } from '@/shared/api/api';
import { TodoTask } from '../../types/TodoTask';

export const createTask = async (listId: number, title: string) => {
    return await $api.post<TodoTask>(`/todos/${listId}/tasks`, {
        title,
    });
};
