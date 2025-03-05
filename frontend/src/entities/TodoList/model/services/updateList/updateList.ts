import { $api } from '@/shared/api/api';
import { TodoList } from '../../types/TodoList';
export const updateList = async (listId: number, title: string) => {
    return await $api.put<TodoList>(`/todos/${listId}`, { name: title });
};
