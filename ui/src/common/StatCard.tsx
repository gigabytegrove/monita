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
    <Box
        sx={{
            height: '100%',
            pl: 1.5,
            py: 0.5,
            borderLeft: 2,
            borderColor: 'primary.main',
        }}>
        <Stack direction="row" spacing={1.25} sx={{alignItems: 'center'}}>
            {icon && (
                <Box sx={{color: 'text.secondary', display: 'grid', placeItems: 'center'}}>
                    {icon}
                </Box>
            )}
            <Box sx={{minWidth: 0}}>
                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 700}}>
                    {label}
                </Typography>
                <Stack direction="row" spacing={1} sx={{alignItems: 'baseline', flexWrap: 'wrap'}}>
                    <Typography variant="h5" sx={{lineHeight: 1.05}}>
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
    </Box>
);

export default StatCard;
