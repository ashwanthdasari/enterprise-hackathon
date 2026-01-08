/**
 * Role-based Permission System
 */

import { UserRole } from '@/types/auth.types';
import { WorkflowStatus, WorkflowActionType } from '@/types/workflow.types';

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewWorkflows: true,
    canCreateWorkflows: true,
    canEditWorkflows: true,
    canDeleteWorkflows: true,
    canApproveWorkflows: true,
    canRejectWorkflows: true,
    canReassignWorkflows: true,
    canViewReports: true,
    canManageSettings: true,
  },
  [UserRole.MANAGER]: {
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewWorkflows: true,
    canCreateWorkflows: true,
    canEditWorkflows: true,
    canDeleteWorkflows: false,
    canApproveWorkflows: true,
    canRejectWorkflows: true,
    canReassignWorkflows: true,
    canViewReports: true,
    canManageSettings: false,
  },
  [UserRole.REVIEWER]: {
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewWorkflows: true,
    canCreateWorkflows: true,
    canEditWorkflows: true,
    canDeleteWorkflows: false,
    canApproveWorkflows: false,
    canRejectWorkflows: false,
    canReassignWorkflows: false,
    canViewReports: true,
    canManageSettings: false,
  },
  [UserRole.VIEWER]: {
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewWorkflows: true,
    canCreateWorkflows: false,
    canEditWorkflows: false,
    canDeleteWorkflows: false,
    canApproveWorkflows: false,
    canRejectWorkflows: false,
    canReassignWorkflows: false,
    canViewReports: false,
    canManageSettings: false,
  },
  [UserRole.USER]: {
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewWorkflows: true,
    canCreateWorkflows: true, // Users can create but not approve
    canEditWorkflows: true,   // specific logic elsewhere
    canDeleteWorkflows: false,
    canApproveWorkflows: false,
    canRejectWorkflows: false,
    canReassignWorkflows: false,
    canViewReports: false,
    canManageSettings: false,
  },
};

export const hasPermission = (role: UserRole, permission: keyof (typeof ROLE_PERMISSIONS)[UserRole]): boolean => {
  const customPermissions = ROLE_PERMISSIONS[role];
  if (!customPermissions) {
    console.warn(`No permissions found for role: ${role}`);
    return false;
  }
  return customPermissions[permission] || false;
};

export const canPerformWorkflowAction = (
  role: UserRole,
  action: WorkflowActionType,
  currentStatus: WorkflowStatus
): boolean => {
  const actionPermissions: Record<WorkflowActionType, { roles: UserRole[]; fromStatuses: WorkflowStatus[] }> = {
    [WorkflowActionType.CREATE]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER],
      fromStatuses: [],
    },
    [WorkflowActionType.SUBMIT]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER],
      fromStatuses: [WorkflowStatus.DRAFT, WorkflowStatus.REOPENED],
    },
    [WorkflowActionType.REVIEW]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [WorkflowStatus.SUBMITTED],
    },
    [WorkflowActionType.APPROVE]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [WorkflowStatus.IN_REVIEW],
    },
    [WorkflowActionType.REJECT]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [WorkflowStatus.IN_REVIEW],
    },
    [WorkflowActionType.REOPEN]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [WorkflowStatus.REJECTED, WorkflowStatus.APPROVED],
    },
    [WorkflowActionType.CANCEL]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [
        WorkflowStatus.DRAFT,
        WorkflowStatus.SUBMITTED,
        WorkflowStatus.IN_REVIEW,
        WorkflowStatus.REOPENED,
      ],
    },
    [WorkflowActionType.COMPLETE]: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      fromStatuses: [WorkflowStatus.APPROVED],
    },
  };

  const permission = actionPermissions[action];
  if (!permission) return false;

  const hasRole = permission.roles.includes(role);
  const hasStatus = permission.fromStatuses.length === 0 || permission.fromStatuses.includes(currentStatus);

  return hasRole && hasStatus;
};

export const getAvailableWorkflowActions = (
  role: UserRole,
  currentStatus: WorkflowStatus
): WorkflowActionType[] => {
  return Object.values(WorkflowActionType).filter((action) =>
    canPerformWorkflowAction(role, action, currentStatus)
  );
};
