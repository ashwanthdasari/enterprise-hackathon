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
import { WorkflowItem } from '../../types/workflow.types';

interface WorkflowDetailsModalProps {
    open: boolean;
    onClose: () => void;
    workflow: WorkflowItem | null;
}

export const WorkflowDetailsModal = ({ open, onClose, workflow }: WorkflowDetailsModalProps) => {
    if (!workflow) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'SUBMITTED':
            case 'IN_REVIEW': return 'warning';
            default: return 'default';
        }
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

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
