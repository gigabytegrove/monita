import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

interface IProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    helper?: string;
}

const StatCard = ({label, value, icon, helper}: IProps) => (
    <Paper
        elevation={0}
        sx={{
            p: 2,
            height: '100%',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2.5,
            backgroundColor: 'background.paper',
        }}>
        <Stack direction="row" spacing={1.5} sx={{alignItems: 'center'}}>
            {icon && (
                <Box
                    sx={{
                        color: 'primary.main',
                        bgcolor: 'action.selected',
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                    }}>
                    {icon}
                </Box>
            )}
            <Box sx={{minWidth: 0}}>
                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 700}}>
                    {label}
                </Typography>
                <Stack direction="row" spacing={1} sx={{alignItems: 'baseline', flexWrap: 'wrap'}}>
                    <Typography variant="h5" sx={{lineHeight: 1.1}}>
                        {value}
                    </Typography>
                    {helper && (
                        <Typography variant="caption" color="text.secondary">
                            {helper}
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Stack>
    </Paper>
);

export default StatCard;
