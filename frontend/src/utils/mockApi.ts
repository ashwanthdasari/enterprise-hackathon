/**
 * Mock API Service for Development
 * Simulates backend API responses when VITE_ENABLE_MOCK_API is true
 */

import { LoginCredentials, LoginResponse, UserRole } from '@/types/auth.types';
import { WorkflowItem, WorkflowStatus } from '@/types/workflow.types';
import { PaginatedResponse } from '@/types/common.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    department: 'IT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    password: 'admin123',
  },
  'manager@example.com': {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    department: 'Operations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    password: 'manager123',
  },
  'reviewer@example.com': {
    id: '3',
    email: 'reviewer@example.com',
    firstName: 'Reviewer',
    lastName: 'User',
    role: UserRole.REVIEWER,
    department: 'Quality',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    password: 'reviewer123',
  },
  'viewer@example.com': {
    id: '4',
    email: 'viewer@example.com',
    firstName: 'Viewer',
    lastName: 'User',
    role: UserRole.VIEWER,
    department: 'Support',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    password: 'viewer123',
  },
};

export const mockLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  await delay(800);

  const user = Object.values(MOCK_USERS).find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token: `mock-token-${user.id}`,
    refreshToken: `mock-refresh-token-${user.id}`,
    expiresIn: 3600,
  };
};

export const mockGetDashboardData = async (_role: string) => {
  await delay(500);

  const baseData = {
    kpis: [
      { label: 'Total Users', value: 1234, trend: 12, trendDirection: 'up' as const },
      { label: 'Active Workflows', value: 56, trend: -3, trendDirection: 'down' as const },
      { label: 'Pending Reviews', value: 23, trend: 5, trendDirection: 'up' as const },
      { label: 'Completed Today', value: 89, trend: 0, trendDirection: 'neutral' as const },
    ],
    charts: {
      workflowTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Completed',
            data: [65, 59, 80, 81, 56, 89],
            borderColor: '#1976d2',
          },
          {
            label: 'Pending',
            data: [28, 48, 40, 19, 86, 27],
            borderColor: '#ed6c02',
          },
        ],
      },
    },
  };

  return baseData;
};

let mockWorkflows: WorkflowItem[] = Array.from({ length: 150 }, (_, i) => ({
  id: `wf-${i + 1}`,
  title: `Workflow Item ${i + 1}`,
  description: `Description for workflow item ${i + 1}`,
  status: [
    WorkflowStatus.DRAFT,
    WorkflowStatus.SUBMITTED,
    WorkflowStatus.IN_REVIEW,
    WorkflowStatus.APPROVED,
    WorkflowStatus.REJECTED,
  ][Math.floor(Math.random() * 5)],
  priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent',
  category: ['Feature', 'Bug', 'Enhancement', 'Documentation'][Math.floor(Math.random() * 4)],
  createdBy: {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  createdByName: 'John Doe',
  assignedTo: Math.random() > 0.5 ? '2' : undefined,
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
  updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
  history: [],
}));

export const mockGetWorkflows = async (params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}): Promise<PaginatedResponse<WorkflowItem>> => {
  await delay(600);

  let filtered = [...mockWorkflows];

  if (params.filters) {
    if (params.filters.status) {
      filtered = filtered.filter((w) => w.status === params.filters!.status);
    }
    if (params.filters.priority) {
      filtered = filtered.filter((w) => w.priority === params.filters!.priority);
    }
    if (params.filters.search) {
      const search = (params.filters.search as string).toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(search) || w.description.toLowerCase().includes(search)
      );
    }
  }

  if (params.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[params.sortBy as keyof WorkflowItem] as any;
      const bVal = b[params.sortBy as keyof WorkflowItem] as any;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return params.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const data = filtered.slice(start, end);

  return {
    data,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(filtered.length / params.pageSize),
  };
};

export const mockCreateWorkflow = async (workflow: Partial<WorkflowItem>): Promise<WorkflowItem> => {
  await delay(500);

  const newWorkflow: WorkflowItem = {
    id: `wf-${mockWorkflows.length + 1}`,
    title: workflow.title || '',
    description: workflow.description || '',
    status: WorkflowStatus.DRAFT,
    priority: workflow.priority || 'medium',
    category: workflow.category || 'Feature',
    createdBy: {
      id: '1',
      email: 'current.user@example.com',
      firstName: 'Current',
      lastName: 'User',
    },
    createdByName: 'Current User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  };

  mockWorkflows.push(newWorkflow);
  return newWorkflow;
};

export const mockUpdateWorkflow = async (
  id: string,
  updates: Partial<WorkflowItem>
): Promise<WorkflowItem> => {
  await delay(500);

  const index = mockWorkflows.findIndex((w) => w.id === id);
  if (index === -1) throw new Error('Workflow not found');

  mockWorkflows[index] = {
    ...mockWorkflows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return mockWorkflows[index];
};

export const mockDeleteWorkflow = async (id: string): Promise<void> => {
  await delay(500);

  const index = mockWorkflows.findIndex((w) => w.id === id);
  if (index === -1) throw new Error('Workflow not found');

  mockWorkflows.splice(index, 1);
};

// --- User Management Mock API ---

let mockUserList = [
  ...Object.values(MOCK_USERS),
  {
    id: '5',
    email: 'sarah.jones@example.com',
    firstName: 'Sarah',
    lastName: 'Jones',
    role: UserRole.REVIEWER,
    department: 'Quality',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
  },
  {
    id: '6',
    email: 'mike.brown@example.com',
    firstName: 'Mike',
    lastName: 'Brown',
    role: UserRole.VIEWER,
    department: 'Support',
    createdAt: '2024-03-10T14:30:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
  },
];

export const mockGetUsers = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  role?: UserRole;
}): Promise<PaginatedResponse<any>> => {
  await delay(700);

  let filtered = [...mockUserList];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const data = filtered.slice(start, end);

  return {
    data,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(filtered.length / params.pageSize),
  };
};

export const mockCreateUser = async (user: any): Promise<any> => {
  await delay(600);
  const newUser = {
    ...user,
    id: String(mockUserList.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUserList.push(newUser);
  return newUser;
};

export const mockUpdateUser = async (id: string, updates: any): Promise<any> => {
  await delay(600);
  const index = mockUserList.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');

  mockUserList[index] = {
    ...mockUserList[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockUserList[index];
};

export const mockDeleteUser = async (id: string): Promise<void> => {
  await delay(600);
  const index = mockUserList.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('User not found');
  mockUserList.splice(index, 1);
};
