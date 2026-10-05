import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, {FC} from 'react';

interface IProps {
    title: string;
    description?: string;
    rightControl?: React.ReactNode;
    maxWidth?: number;
    eyebrow?: string;
}

const DefaultPage: FC<React.PropsWithChildren<IProps>> = ({
    title,
    description,
    rightControl,
    maxWidth = 1320,
    eyebrow,
    children,
}) => (
    <Box component="main" sx={{width: '100%', maxWidth, mx: 'auto', pb: 5}}>
        <Stack spacing={3}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: rightControl ? 'minmax(0,1fr) auto' : '1fr'},
                    gap: 2,
                    alignItems: 'end',
                    pb: 2.25,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}>
                <Box sx={{minWidth: 0}}>
                    {eyebrow && (
                        <Typography
                            variant="overline"
                            color="primary.main"
                            sx={{display: 'block', mb: 0.5}}>
                            {eyebrow}
                        </Typography>
                    )}
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontSize: {xs: '1.9rem', sm: '2.35rem', lg: '2.65rem'},
                            lineHeight: 1.02,
                            letterSpacing: '-0.045em',
                        }}>
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            color="text.secondary"
                            sx={{mt: 0.85, maxWidth: 760, fontSize: {sm: '1rem'}}}>
                            {description}
                        </Typography>
                    )}
                </Box>
                {rightControl && <Box sx={{display: 'flex', justifyContent: {md: 'flex-end'}}}>{rightControl}</Box>}
            </Box>
            {children}
        </Stack>
    </Box>
);

export default DefaultPage;
