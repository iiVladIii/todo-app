import { $api } from '@/shared/api/api';
import { TodoList } from '../../types/TodoList';
export const fetchLists = async () => {
    return await $api.get<TodoList[]>(`/todos/`);
};
