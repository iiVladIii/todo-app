import { $api } from '@/shared/api/api';

export const deleteList = async (listId: number) => {
    return await $api.delete(`/todos/${listId}`);
};
