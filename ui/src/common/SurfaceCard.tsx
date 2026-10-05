import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

interface IProps {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    flush?: boolean;
}

const SurfaceCard = ({title, subtitle, action, children, flush = false}: IProps) => (
    <Paper
        elevation={0}
        sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
        }}>
        {(title || subtitle || action) && (
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={1.5}
                sx={{
                    px: {xs: 2, sm: 2.5},
                    py: 2,
                    justifyContent: 'space-between',
                    alignItems: {xs: 'stretch', sm: 'center'},
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                }}>
                <Box sx={{minWidth: 0}}>
                    {title && (
                        <Typography variant="subtitle1" sx={{fontWeight: 760}}>
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.15}}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && <Box sx={{flexShrink: 0}}>{action}</Box>}
            </Stack>
        )}
        <Box sx={flush ? undefined : {p: {xs: 2, sm: 2.5}}}>{children}</Box>
    </Paper>
);

export default SurfaceCard;
