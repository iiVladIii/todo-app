import { $api } from '@/shared/api/api';
import { TodoList } from '../../types/TodoList';

export const createList = async (title: string) => {
    return await $api.post<TodoList>('/todos/', { name: title });
};
