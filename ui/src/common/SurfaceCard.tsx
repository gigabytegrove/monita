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
    <Box
        component="section"
        sx={{
            py: {xs: 2.25, sm: 3},
            borderBottom: 1,
            borderColor: 'divider',
            '&:first-of-type': {pt: 0},
            '&:last-of-type': {borderBottom: 0, pb: 0},
        }}>
        {(title || subtitle || action) && (
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={1.5}
                sx={{
                    mb: 2,
                    justifyContent: 'space-between',
                    alignItems: {xs: 'stretch', sm: 'flex-start'},
                }}>
                <Box sx={{minWidth: 0}}>
                    {title && (
                        <Typography
                            variant="h6"
                            sx={{fontSize: '1rem', fontWeight: 760, letterSpacing: '-0.015em'}}>
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{mt: 0.35, maxWidth: 760}}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && <Box sx={{flexShrink: 0}}>{action}</Box>}
            </Stack>
        )}
        <Box sx={flush ? undefined : {}}>{children}</Box>
    </Box>
);

export default SurfaceCard;
