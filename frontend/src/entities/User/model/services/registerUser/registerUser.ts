import { $api } from '@/shared/api/api';

export const registerUser = async (username: string, password: string) => {
    return await $api.post('/auth/register', { username, password });
};
