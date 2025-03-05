import { $api } from '@/shared/api/api';
import { TodoTask } from '../../types/TodoTask';

export const updateTask = async ({
    taskId,
    title,
    completed,
}: {
    taskId: number;
    title: string;
    completed: boolean;
}) => {
    return await $api.put<TodoTask>(`/todos/tasks/${taskId}`, {
        title,
        completed,
    });
};
