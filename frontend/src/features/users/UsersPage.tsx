import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    TablePagination,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/auth.types';
import { userService, User } from '@/services/userService';

export const UsersPage = () => {
    const theme = useTheme();
    const { user: currentUser } = useAppSelector((state) => state.auth);
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    // Form State
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: UserRole.VIEWER,
        department: '',
        password: '',
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                department: user.department || '',
                password: '', // Password not editable directly here usually
            });
        } else {
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: UserRole.VIEWER,
                department: '',
                password: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
            } else {
                await userService.create({
                    ...formData,
                    active: true
                });
            }
            handleCloseDialog();
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(id);
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const filteredUsers = users.filter(u =>
        (u.firstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (u.lastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return 'error';
            case UserRole.MANAGER: return 'warning';
            case UserRole.REVIEWER: return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        User Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your organization's users and their roles.
                    </Typography>
                </Box>
                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            boxShadow: '0 4px 14px rgba(0, 45, 98, 0.4)',
                        }}
                    >
                        Create User
                    </Button>
                )}
            </Box>

            <Paper
                sx={{
                    p: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 253, 208, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search users by name, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' }
                        }}
                    />
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3 }}>
                        <FilterIcon />
                    </IconButton>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                {isAdmin && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((u) => (
                                <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 600
                                                }}
                                            >
                                                {(u.firstName || '').charAt(0)}{(u.lastName || '').charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600}>{u.firstName} {u.lastName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.role.toUpperCase()}
                                            size="small"
                                            color={getRoleColor(u.role) as any}
                                            variant="soft"
                                            sx={{ fontWeight: 600, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell>{u.department || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.active ? "Active" : "Inactive"}
                                            size="small"
                                            color={u.active ? "success" : "default"}
                                            sx={{ borderRadius: 1.5, fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpenDialog(u)} color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(u.id)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, bgcolor: '#FFFDD0' } }}>
                <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {editingUser ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                        <TextField
                            label="First Name"
                            fullWidth
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        <TextField
                            label="Email Address"
                            fullWidth
                            disabled={!!editingUser}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ gridColumn: 'span 2' }}
                        />
                        {!editingUser && (
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                sx={{ gridColumn: 'span 2' }}
                            />
                        )}
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role}
                                label="Role"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            >
                                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                                <MenuItem value={UserRole.MANAGER}>Manager</MenuItem>
                                <MenuItem value={UserRole.REVIEWER}>Reviewer</MenuItem>
                                <MenuItem value={UserRole.VIEWER}>Viewer</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Department"
                            fullWidth
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
                        {editingUser ? 'Save Changes' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
