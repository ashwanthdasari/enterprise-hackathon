import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';

export const useSnackbar = () => {
    const dispatch = useDispatch();

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        dispatch(addNotification({ message, severity }));
    };

    return { showSnackbar };
};
