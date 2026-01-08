import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/auth.types';
import { hasPermission } from '@/utils/rolePermissions';

const DRAWER_WIDTH = 240;

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  requiredPermission?: string;
  allowedRoles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Workflows',
    path: '/workflows',
    icon: <AssignmentIcon />,
    requiredPermission: 'canViewWorkflows',
  },
  {
    title: 'Users',
    path: '/users',
    icon: <PeopleIcon />,
    requiredPermission: 'canViewUsers',
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <AssessmentIcon />,
    requiredPermission: 'canViewReports',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    requiredPermission: 'canManageSettings',
  },
];

interface SidebarProps {
  open: boolean;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const filteredMenuItems = menuItems.filter((item) => {
    if (!user) return false;
    if (!item.requiredPermission) return true;
    return hasPermission(user.role, item.requiredPermission as never);
  });

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#002D62', // Deep Navy
          color: '#ffffff',
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Toolbar sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FFFDD0 0%, #F5F5DC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <Typography variant="h6" color="primary" fontWeight={900}>E</Typography>
          </Box>
          <Typography variant="h6" noWrap component="div" fontWeight={700} sx={{ letterSpacing: 1 }}>
            ENTRPRZ
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 2 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 253, 208, 0.15)',
                    color: '#FFFDD0',
                    '&:hover': {
                      bgcolor: 'rgba(255, 253, 208, 0.25)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#FFFDD0',
                      transform: 'scale(1.1)',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 700,
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateX(4px)',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'inherit' : 'rgba(255,255,255,0.7)',
                    minWidth: 45,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
            LOGGED IN AS
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Chip
            label={user?.role.toUpperCase()}
            size="small"
            sx={{
              mt: 1,
              fontSize: '0.65rem',
              height: 20,
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#ffffff'
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
