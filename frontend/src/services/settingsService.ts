import api from './api';
import { ChangePasswordRequest } from '@/types/auth.types';

export const settingsService = {
    changePassword: async (data: ChangePasswordRequest) => {
        await api.post('/auth/change-password', data);
    },
};
