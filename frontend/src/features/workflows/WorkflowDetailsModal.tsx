import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Chip,
    Box,
    Divider,
} from '@mui/material';
import { WorkflowItem, WorkflowActionType } from '../../types/workflow.types';
import { useAppSelector } from '../../store/hooks';
import { getAvailableWorkflowActions } from '../../utils/rolePermissions';

interface WorkflowDetailsModalProps {
    open: boolean;
    onClose: () => void;
    workflow: WorkflowItem | null;
    onStatusUpdate?: (status: string) => Promise<void>;
}

export const WorkflowDetailsModal = ({ open, onClose, workflow, onStatusUpdate }: WorkflowDetailsModalProps) => {
    const { user } = useAppSelector((state) => state.auth);

    if (!workflow) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'COMPLETED': return 'success';
            case 'REJECTED':
            case 'CANCELLED': return 'error';
            case 'SUBMITTED':
            case 'IN_REVIEW': return 'warning';
            case 'REOPENED': return 'info';
            default: return 'default';
        }
    };

    const availableActions = user ? getAvailableWorkflowActions(user.role, workflow.status) : [];

    const handleAction = async (action: WorkflowActionType) => {
        if (!onStatusUpdate) return;

        let newStatus = '';
        switch (action) {
            case WorkflowActionType.APPROVE: newStatus = 'APPROVED'; break;
            case WorkflowActionType.REJECT: newStatus = 'REJECTED'; break;
            case WorkflowActionType.COMPLETE: newStatus = 'COMPLETED'; break;
            case WorkflowActionType.CANCEL: newStatus = 'CANCELLED'; break;
            case WorkflowActionType.REOPEN: newStatus = 'REOPENED'; break;
            case WorkflowActionType.SUBMIT: newStatus = 'SUBMITTED'; break;
            case WorkflowActionType.REVIEW: newStatus = 'IN_REVIEW'; break;
            default: return;
        }

        await onStatusUpdate(newStatus);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                    {workflow.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    ID: {workflow.id}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Status
                            </Typography>
                            <Chip
                                label={workflow.status}
                                color={getStatusColor(workflow.status) as any}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Priority
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {workflow.priority}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Category
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {workflow.category}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {workflow.description}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Created By
                        </Typography>
                        <Typography variant="body2">
                            {workflow.createdBy.firstName} {workflow.createdBy.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {workflow.createdBy.email}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Created At
                        </Typography>
                        <Typography variant="body2">
                            {new Date(workflow.createdAt).toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ gap: 1, p: 2 }}>
                {availableActions.includes(WorkflowActionType.REOPEN) && (
                    <Button
                        onClick={() => handleAction(WorkflowActionType.REOPEN)}
                        color="info"
                        variant="outlined"
                    >
                        Reopen
                    </Button>
                )}
                {availableActions.includes(WorkflowActionType.CANCEL) && (
                    <Button
                        onClick={() => handleAction(WorkflowActionType.CANCEL)}
                        color="error"
                    >
                        Cancel Workflow
                    </Button>
                )}
                {availableActions.includes(WorkflowActionType.COMPLETE) && (
                    <Button
                        onClick={() => handleAction(WorkflowActionType.COMPLETE)}
                        color="success"
                        variant="contained"
                    >
                        Mark Completed
                    </Button>
                )}
                {/* Standard Approve/Reject could also go here if desired, keeping simple for now based on request */}

                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
