import api from './api';
import { WorkflowItem, CreateWorkflowRequest } from '../types/workflow.types';

export const workflowService = {
    getWorkflows: async (): Promise<WorkflowItem[]> => {
        const response = await api.get('/workflows');
        return response.data;
    },

    createWorkflow: async (data: CreateWorkflowRequest): Promise<WorkflowItem> => {
        const response = await api.post('/workflows', data);
        return response.data;
    },

    // Placeholder for future implementation
    updateStatus: async (id: string, status: string): Promise<WorkflowItem> => {
        const response = await api.patch(`/workflows/${id}/status`, { status });
        return response.data;
    }
};
