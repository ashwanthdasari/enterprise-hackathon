import api from './api';

export const reportsService = {
    exportUsers: async () => {
        const response = await api.get('/reports/users/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },
    exportWorkflows: async () => {
        const response = await api.get('/reports/workflows/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'workflows.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
