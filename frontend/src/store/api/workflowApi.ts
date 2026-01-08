import { baseApi } from './baseApi';
import { WorkflowItem, CreateWorkflowRequest } from '../../types/workflow.types';

export const workflowApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWorkflows: builder.query<WorkflowItem[], void>({
            query: () => '/workflows',
            providesTags: ['Workflow'],
        }),
        createWorkflow: builder.mutation<WorkflowItem, CreateWorkflowRequest>({
            query: (data) => ({
                url: '/workflows',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Workflow', 'Dashboard'],
        }),
        updateWorkflowStatus: builder.mutation<WorkflowItem, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/workflows/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Workflow', 'Dashboard'],
        }),
    }),
});

export const {
    useGetWorkflowsQuery,
    useCreateWorkflowMutation,
    useUpdateWorkflowStatusMutation,
} = workflowApi;
