import IconButton from '@mui/material/IconButton';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';

const ScrollUpButton = () => {
    const [state, setState] = React.useState({display: 'none', opacity: 0});

    React.useEffect(() => {
        const scrollHandler = () => {
            const currentScrollPos = Math.max(window.pageYOffset - 1000, 0);
            const opacity = Math.min(currentScrollPos / 1000, 1);
            const nextState = {display: currentScrollPos > 0 ? 'inherit' : 'none', opacity};
            setState((current) =>
                current.display === nextState.display && current.opacity === nextState.opacity
                    ? current
                    : nextState
            );
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, []);

    return (
        <IconButton
            aria-label="Scroll to top"
            sx={{
                position: 'fixed',
                bottom: 22,
                right: 22,
                zIndex: 1000,
                display: state.display,
                opacity: state.opacity,
                width: 38,
                height: 38,
                border: 1,
                borderColor: 'divider',
                borderRadius: 0.75,
                bgcolor: 'background.paper',
                '&:hover': {bgcolor: 'action.hover'},
            }}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <KeyboardArrowUp />
        </IconButton>
    );
};

export default ScrollUpButton;
