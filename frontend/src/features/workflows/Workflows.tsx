import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Typography,
  IconButton,
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
import { workflowService } from '../../services/workflowService';
import { WorkflowItem, CreateWorkflowRequest } from '../../types/workflow.types';
import { useSnackbar } from '../../hooks/useSnackbar';
import { CreateWorkflowModal } from './CreateWorkflowModal';
import { hasPermission } from '../../utils/rolePermissions';
import { UserRole } from '../../types/auth.types';

import { useAppSelector } from '../../store/hooks';

import { WorkflowDetailsModal } from './WorkflowDetailsModal';

export const Workflows = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getWorkflows();
      setWorkflows(data);
    } catch (error) {
      showSnackbar('Failed to fetch workflows', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateWorkflow = async (data: CreateWorkflowRequest) => {
    try {
      setIsSubmitting(true);
      await workflowService.createWorkflow(data);
      showSnackbar('Workflow created successfully!', 'success');
      setIsCreateModalOpen(false);
      fetchWorkflows(); // Refresh list
    } catch (error) {
      showSnackbar('Failed to create workflow', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (workflow: WorkflowItem) => {
    setSelectedWorkflow(workflow);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'SUBMITTED':
      case 'IN_REVIEW':
        return 'warning';
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
            await workflowService.updateStatus(params.row.id, newStatus);
            showSnackbar(`Workflow ${newStatus.toLowerCase()} successfully`, 'success');
            fetchWorkflows();
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
      </Box>

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
          rows={workflows}
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
      />
    </Container>
  );
};
