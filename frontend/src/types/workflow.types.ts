/**
 * Workflow Related Types
 */

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REOPENED = 'REOPENED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum WorkflowActionType {
  CREATE = 'CREATE',
  SUBMIT = 'SUBMIT',
  REVIEW = 'REVIEW',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REOPEN = 'REOPEN',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  priority: string;   // Keeping generic string as backend sends string
  category: string;
  createdBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;

  // Future fields (optional for now)
  assignedTo?: string;
  dueDate?: string;
}

export interface CreateWorkflowRequest {
  title: string;
  description: string;
  priority: string;
  category: string;
}
