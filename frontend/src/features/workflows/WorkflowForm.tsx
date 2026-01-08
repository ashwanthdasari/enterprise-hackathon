import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Box,
} from '@mui/material';
import { workflowFormSchema, WorkflowFormData } from '@/utils/validation';

interface WorkflowFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WorkflowFormData) => Promise<void>;
  initialData?: Partial<WorkflowFormData>;
  isLoading?: boolean;
}

export const WorkflowForm = ({ open, onClose, onSubmit, initialData, isLoading }: WorkflowFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      priority: 'medium',
      category: '',
    },
  });

  const handleFormSubmit = async (data: WorkflowFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: '#FFFDD0', // Cream
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', px: 4, pt: 4 }}>
          {initialData ? 'Refine Workflow' : 'Initialize Workflow'}
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Title"
                  placeholder="Enter a descriptive title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={isLoading}
                  InputProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' } }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Context / Description"
                  multiline
                  rows={4}
                  placeholder="Provide detailed context for this workflow..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                  InputProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' } }}
                />
              )}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Priority Level"
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    disabled={isLoading}
                    SelectProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' } }}
                  >
                    <MenuItem value="low">Low Priority</MenuItem>
                    <MenuItem value="medium">Medium Priority</MenuItem>
                    <MenuItem value="high">High Priority</MenuItem>
                    <MenuItem value="urgent">Urgent Action</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Vertical / Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    disabled={isLoading}
                    SelectProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' } }}
                  >
                    <MenuItem value="Feature">System Feature</MenuItem>
                    <MenuItem value="Bug">Defect / Bug</MenuItem>
                    <MenuItem value="Enhancement">Optimization</MenuItem>
                    <MenuItem value="Documentation">Technical Docs</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Expected Completion"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading}
                  InputProps={{ sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' } }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button onClick={handleClose} disabled={isLoading} sx={{ borderRadius: 2, px: 3 }}>
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(0, 45, 98, 0.4)',
              fontWeight: 700
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : initialData ? 'Commit Changes' : 'Launch Workflow'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
