import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ConnectionErrorBannerProps {
    height: number;
    retry: () => void;
    message: string;
}

export const ConnectionErrorBanner = ({retry, message}: ConnectionErrorBannerProps) => (
    <Alert
        severity="error"
        variant="filled"
        square
        action={
            <Button color="inherit" size="small" onClick={retry}>
                Retry
            </Button>
        }
        sx={{
            borderRadius: 0,
            minHeight: 44,
            alignItems: 'center',
            '& .MuiAlert-message': {py: 0.5},
        }}>
        {message}
    </Alert>
);
