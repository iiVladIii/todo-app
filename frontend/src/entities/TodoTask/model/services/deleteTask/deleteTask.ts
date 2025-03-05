import { $api } from '@/shared/api/api';

export const deleteTask = async (taskId: number) => {
    return await $api.delete(`/todos/tasks/${taskId}`);
};
