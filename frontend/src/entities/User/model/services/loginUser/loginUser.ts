import { $api } from '@/shared/api/api';

export const loginUser = async (username: string, password: string) => {
    return await $api.post<{ token: string }>('/auth/login', {
        username,
        password,
    });
};
