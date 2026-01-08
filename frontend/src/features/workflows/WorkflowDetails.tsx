import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
  TextField,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { WorkflowItem, WorkflowActionType, WorkflowStatus } from '@/types/workflow.types';
import { useAppSelector } from '@/store/hooks';
import { getAvailableWorkflowActions } from '@/utils/rolePermissions';

interface WorkflowDetailsProps {
  open: boolean;
  workflow: WorkflowItem | null;
  onClose: () => void;
  onAction: (action: WorkflowActionType, comment?: string) => Promise<void>;
  onEdit: () => void;
}

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

const actionLabels: Record<WorkflowActionType, string> = {
  [WorkflowActionType.CREATE]: 'Create',
  [WorkflowActionType.SUBMIT]: 'Submit for Review',
  [WorkflowActionType.REVIEW]: 'Start Review',
  [WorkflowActionType.APPROVE]: 'Approve',
  [WorkflowActionType.REJECT]: 'Reject',
  [WorkflowActionType.REOPEN]: 'Reopen',
  [WorkflowActionType.CANCEL]: 'Cancel',
  [WorkflowActionType.COMPLETE]: 'Complete',
};

export const WorkflowDetails = ({ open, workflow, onClose, onAction, onEdit }: WorkflowDetailsProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedAction, setSelectedAction] = useState<WorkflowActionType | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!workflow || !user) return null;

  const availableActions = getAvailableWorkflowActions(user.role, workflow.status);

  const handleAction = async (action: WorkflowActionType) => {
    const requiresComment = action === WorkflowActionType.REJECT || action === WorkflowActionType.REOPEN;

    if (requiresComment) {
      setSelectedAction(action);
    } else {
      setIsLoading(true);
      try {
        await onAction(action);
        onClose();
      } catch (error) {
        console.error('Action failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedAction) return;

    setIsLoading(true);
    try {
      await onAction(selectedAction, comment);
      setSelectedAction(null);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: '#FFFDD0',
            backgroundImage: 'none',
          }
        }}
      >
        <DialogTitle sx={{ px: 4, pt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="primary.main">{workflow.title}</Typography>
              <Typography variant="caption" color="text.secondary">ID: {workflow.id}</Typography>
            </Box>
            <Chip
              label={workflow.status.replace('_', ' ').toUpperCase()}
              color={statusColors[workflow.status]}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Stack spacing={3}>
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
                Description & Scope
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>{workflow.description}</Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.3)' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>PRIORITY</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={workflow.priority.toUpperCase()}
                    size="small"
                    color={workflow.priority === 'urgent' ? 'error' : 'primary'}
                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.3)' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>CATEGORY</Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>{workflow.category}</Typography>
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.3)' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>OWNER</Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>{workflow.createdByName}</Typography>
              </Paper>
            </Box>

            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(0,45,98,0.03)', border: '1px solid rgba(0,45,98,0.05)' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={800} color="primary.main">
                Workflow Progression
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(0,45,98,0.1)' }} />
              {workflow.history.length > 0 ? (
                <List disablePadding>
                  {workflow.history.map((entry, index) => (
                    <ListItem key={entry.id} sx={{ px: 0, py: 2, position: 'relative' }}>
                      {index !== workflow.history.length - 1 && (
                        <Box sx={{ position: 'absolute', left: 12, top: 40, bottom: 0, width: 2, bgcolor: 'rgba(0,45,98,0.1)' }} />
                      )}
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', mr: 2, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight={700}>{entry.action.replace('_', ' ').toUpperCase()}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(entry.timestamp).toLocaleString()}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>by {entry.performedByName}</Typography>
                        {entry.comment && (
                          <Typography variant="body2" sx={{ mt: 1, p: 1.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}>
                            {entry.comment}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                  No history available for this workflow.
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {availableActions.map((action) => (
              <Button
                key={action}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 700,
                  boxShadow: 'none',
                  bgcolor: action === WorkflowActionType.APPROVE ? 'success.main' : action === WorkflowActionType.REJECT ? 'error.main' : 'primary.main',
                }}
                onClick={() => handleAction(action)}
                disabled={isLoading}
              >
                {actionLabels[action]}
              </Button>
            ))}
            <Button variant="outlined" onClick={onEdit} disabled={isLoading} sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}>
              Edit Details
            </Button>
          </Box>
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={selectedAction !== null} onClose={() => setSelectedAction(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAction && actionLabels[selectedAction]}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            This action requires a comment explaining your decision.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAction(null)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAction}
            disabled={!comment.trim() || isLoading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
