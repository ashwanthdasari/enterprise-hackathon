import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  IconButton,
  Pagination,
  Avatar,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { VirtualizedTable, Column } from '@/components/common/VirtualizedTable';
import { WorkflowItem, WorkflowStatus } from '@/types/workflow.types';
import { mockGetWorkflows } from '@/utils/mockApi';
import { useAppSelector } from '@/store/hooks';
import { hasPermission } from '@/utils/rolePermissions';

const statusColors: Record<WorkflowStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  [WorkflowStatus.DRAFT]: 'default',
  [WorkflowStatus.SUBMITTED]: 'primary',
  [WorkflowStatus.IN_REVIEW]: 'warning',
  [WorkflowStatus.APPROVED]: 'success',
  [WorkflowStatus.REJECTED]: 'error',
  [WorkflowStatus.REOPENED]: 'warning',
  [WorkflowStatus.COMPLETED]: 'success',
  [WorkflowStatus.CANCELLED]: 'default',
};

interface WorkflowListProps {
  onCreateNew: () => void;
  onViewDetails: (workflow: WorkflowItem) => void;
}

export const WorkflowList = ({ onCreateNew, onViewDetails }: WorkflowListProps) => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const canCreate = user && hasPermission(user.role, 'canCreateWorkflows');

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const response = await mockGetWorkflows({
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters: {
          ...(filters.status && { status: filters.status }),
          ...(filters.priority && { priority: filters.priority }),
          ...(filters.search && { search: filters.search }),
        },
      });
      setWorkflows(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, [page, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleApplyFilters = () => {
    loadWorkflows();
  };

  const columns: Column<WorkflowItem>[] = useMemo(
    () => [
      {
        id: 'title',
        label: 'Title',
        sortable: true,
        width: '25%',
        render: (row) => (
          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
            {row.title}
          </Typography>
        )
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        width: '12%',
        render: (row) => (
          <Chip
            label={row.status.replace('_', ' ').toUpperCase()}
            color={statusColors[row.status]}
            size="small"
            sx={{ fontWeight: 700, borderRadius: 1.5, fontSize: '0.65rem' }}
          />
        ),
      },
      {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        width: '10%',
        render: (row) => (
          <Chip
            label={row.priority.toUpperCase()}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: 1.5,
              fontSize: '0.65rem',
              borderColor: row.priority === 'urgent' ? 'error.main' : 'inherit',
              color: row.priority === 'urgent' ? 'error.main' : 'inherit',
            }}
          />
        ),
      },
      {
        id: 'category',
        label: 'Category',
        width: '12%',
        render: (row) => (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {row.category}
          </Typography>
        )
      },
      {
        id: 'createdByName',
        label: 'Assignee',
        width: '15%',
        render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
              {row.createdByName[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>{row.createdByName}</Typography>
          </Box>
        )
      },
      {
        id: 'updatedAt',
        label: 'Last Update',
        sortable: true,
        width: '13%',
        render: (row) => (
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {new Date(row.updatedAt).toLocaleDateString()}
          </Typography>
        )
      },
    ],
    [theme.palette.primary.main]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary">
            Workflows
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your enterprise operational flows.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={loadWorkflows} sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
            <RefreshIcon color="primary" />
          </IconButton>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              sx={{
                borderRadius: 3,
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              }}
            >
              New Workflow
            </Button>
          )}
        </Box>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'rgba(255, 253, 208, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <TextField
          placeholder="Quick search..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ minWidth: 300 }}
          size="small"
          InputProps={{
            sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.6)' }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.6)' }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.values(WorkflowStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.6)' }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleApplyFilters}
          sx={{ borderRadius: 3, px: 4, bgcolor: 'primary.dark' }}
        >
          Filter
        </Button>
      </Paper>

      <Box sx={{
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <VirtualizedTable
          columns={columns}
          data={workflows}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={onViewDetails}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: 2,
              fontWeight: 700,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};
