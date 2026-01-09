import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { CreateWorkflowRequest } from '../../types/workflow.types';

interface CreateWorkflowModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateWorkflowRequest) => Promise<void>;
    isLoading?: boolean;
}

export const CreateWorkflowModal = ({
    open,
    onClose,
    onSubmit,
    isLoading = false,
}: CreateWorkflowModalProps) => {
    const [formData, setFormData] = useState<CreateWorkflowRequest>({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
    });

    const handleChange = (field: keyof CreateWorkflowRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        // Reset form on success (the parent handles closing, but we can reset state)
        setFormData({
            title: '',
            description: '',
            priority: 'MEDIUM',
            category: 'GENERAL',
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Workflow</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g. Purchase Request"
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe the workflow details..."
                        />

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={formData.priority}
                                label="Priority"
                                onChange={(e) => handleChange('priority', e.target.value)}
                            >
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="URGENT">Urgent</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                <MenuItem value="GENERAL">General</MenuItem>
                                <MenuItem value="HR">Human Resources</MenuItem>
                                <MenuItem value="FINANCE">Finance</MenuItem>
                                <MenuItem value="IT">IT Support</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Workflow'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
