import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Paper,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { WorkflowItem, CreateWorkflowRequest } from '../../types/workflow.types';
import { useSnackbar } from '../../hooks/useSnackbar';
import { CreateWorkflowModal } from './CreateWorkflowModal';
import { hasPermission } from '../../utils/rolePermissions';
import { useAppSelector } from '../../store/hooks';
import {
  useGetWorkflowsQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowStatusMutation,
} from '../../store/api/workflowApi';

import { WorkflowDetailsModal } from './WorkflowDetailsModal';

export const Workflows = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: workflows = [], isLoading: loading } = useGetWorkflowsQuery();
  const [createWorkflow, { isLoading: isSubmitting }] = useCreateWorkflowMutation();
  const [updateStatus] = useUpdateWorkflowStatusMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('ALL');
  const { showSnackbar } = useSnackbar();

  const canCreate = user && hasPermission(user.role, 'canCreateWorkflows');

  const handleCreateWorkflow = async (data: CreateWorkflowRequest) => {
    try {
      await createWorkflow(data).unwrap();
      showSnackbar('Workflow created successfully!', 'success');
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Create workflow error:', error);
      // Fallback to JSON stringify to see full structure if message is missing
      const msg = error?.data?.message || error?.error || JSON.stringify(error);
      showSnackbar(msg, 'error');
    }
  };

  const handleViewDetails = (workflow: WorkflowItem) => {
    setSelectedWorkflow(workflow);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
      case 'CANCELLED':
        return 'error';
      case 'SUBMITTED':
      case 'IN_REVIEW':
        return 'warning';
      case 'REOPENED':
        return 'info';
      case 'DRAFT':
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          size="small"
          color={getStatusColor(params.value as string) as any}
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 180,
      valueGetter: (_: any, row: any) => row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : 'Unknown'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (value: any) => new Date(value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const handleStatusUpdate = async (newStatus: string) => {
          try {
            await updateStatus({ id: params.row.id, status: newStatus }).unwrap();
            showSnackbar(`Workflow ${newStatus.toLowerCase()} successfully`, 'success');
          } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to update status';
            showSnackbar(msg, 'error');
          }
        };

        // Check if user has permission to approve/reject
        const canApprove = user && hasPermission(user.role, 'canApproveWorkflows');

        return (
          <Box>
            {canApprove && (
              <>
                <Tooltip title="Approve">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleStatusUpdate('APPROVED')}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleStatusUpdate('REJECTED')}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleViewDetails(params.row as WorkflowItem)}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const filteredWorkflows = workflows.filter((workflow) => {
    if (currentTab === 'ALL') return true;
    return workflow.status === currentTab;
  });

  const handleModalStatusUpdate = async (newStatus: string) => {
    if (!selectedWorkflow) return;
    try {
      await updateStatus({ id: selectedWorkflow.id, status: newStatus }).unwrap();
      showSnackbar(`Workflow ${newStatus.toLowerCase()} successfully`, 'success');
      // No need to close modal manually here as the modal handles it, 
      // but if we want to update the selectedWorkflow local state we could.
      // However, the query will invalidate and refetch.
      setIsDetailsOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update status';
      showSnackbar(msg, 'error');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Workflows
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your workflow requests
          </Typography>
        </Box>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #002D62 30%, #004ba0 90%)',
              boxShadow: '0 3px 5px 2px rgba(0, 45, 98, .3)',
            }}
          >
            New Workflow
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="All" value="ALL" />
          <Tab label="Draft" value="DRAFT" />
          <Tab label="Submitted" value="SUBMITTED" />
          <Tab label="In Review" value="IN_REVIEW" />
          <Tab label="Approved" value="APPROVED" />
          <Tab label="Rejected" value="REJECTED" />
          <Tab label="Reopened" value="REOPENED" />
          <Tab label="Completed" value="COMPLETED" />
          <Tab label="Cancelled" value="CANCELLED" />
        </Tabs>
      </Paper>

      <Card
        sx={{
          height: 600,
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredWorkflows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'rgba(0,0,0,0.02)',
              fontWeight: 700
            }
          }}
        />
      </Card>

      <CreateWorkflowModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkflow}
        isLoading={isSubmitting}
      />

      <WorkflowDetailsModal
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        workflow={selectedWorkflow}
        onStatusUpdate={handleModalStatusUpdate}
      />
    </Container>
  );
};
