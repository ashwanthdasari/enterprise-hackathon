import api from './api';
import { UserRole } from '@/types/auth.types';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    department?: string;
    active: boolean;
    password?: string; // Only for creation/update
}

export const userService = {
    getAll: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    create: async (user: Partial<User>) => {
        const response = await api.post<User>('/users', user);
        return response.data;
    },

    update: async (id: number, user: Partial<User>) => {
        const response = await api.put<User>(`/users/${id}`, user);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/users/${id}`);
    },
};
