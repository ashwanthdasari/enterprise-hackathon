import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Switch,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    DarkMode as DarkModeIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { useThemeMode } from '@/theme/ThemeProvider';
import { settingsService } from '@/services/settingsService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index} style={{ padding: '24px 0' }}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export const SettingsPage = () => {
    const { mode, toggleTheme } = useThemeMode();
    const [tabIndex, setTabIndex] = useState(0);

    // Notifications State (Local Storage for demo)
    const [notifications, setNotifications] = useState({
        email: true,
        system: true,
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordSubmit = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setPasswordError('');
        setPasswordSuccess('');
        try {
            await settingsService.changePassword({
                currentPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordSuccess('Password changed successfully!');
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setPasswordError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Manage your preferences and security settings.
            </Typography>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, v) => setTabIndex(v)}
                    variant="fullWidth"
                    sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<DarkModeIcon />} label="Appearance" />
                    <Tab icon={<SecurityIcon />} label="Security" />
                    <Tab icon={<NotificationsIcon />} label="Notifications" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {/* Appearance Tab */}
                    <TabPanel value={tabIndex} index={0}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Dark Mode"
                                    secondary="Switch between light and dark themes"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={mode === 'dark'}
                                        onChange={toggleTheme}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                            Your theme preference is saved automatically.
                        </Alert>
                    </TabPanel>

                    {/* Security Tab */}
                    <TabPanel value={tabIndex} index={1}>
                        <Typography variant="h6" gutterBottom>Change Password</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                            {passwordError && <Alert severity="error">{passwordError}</Alert>}
                            {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}

                            <TextField
                                label="Current Password"
                                type="password"
                                fullWidth
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                                onClick={handlePasswordSubmit}
                                sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </TabPanel>

                    {/* Notifications Tab */}
                    <TabPanel value={tabIndex} index={2}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Email Notifications"
                                    secondary="Receive updates about your workflow status via email"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={notifications.email}
                                        onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="System Alerts"
                                    secondary="Show popup notifications in the application"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={notifications.system}
                                        onChange={() => setNotifications(prev => ({ ...prev, system: !prev.system }))}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </TabPanel>
                </Box>
            </Paper>
        </Box>
    );
};
