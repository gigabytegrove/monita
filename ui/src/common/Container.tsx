import Box from '@mui/material/Box';
import * as React from 'react';

interface IProps {
    style?: React.CSSProperties;
}

const Container: React.FC<React.PropsWithChildren<IProps>> = ({children, style}) => (
    <Box
        sx={{
            p: 2,
            borderTop: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
        }}
        style={style}>
        {children}
    </Box>
);

export default Container;
