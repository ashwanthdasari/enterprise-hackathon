import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/store/slices/uiSlice';

export const NotificationSnackbar = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    id: string;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
      setOpen(true);
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      if (currentNotification) {
        dispatch(removeNotification(currentNotification.id));
        setCurrentNotification(null);
      }
    }, 200);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={currentNotification?.severity} sx={{ width: '100%' }}>
        {currentNotification?.message}
      </Alert>
    </Snackbar>
  );
};
