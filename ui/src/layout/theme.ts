import {alpha, createTheme, PaletteMode} from '@mui/material/styles';

export type ThemeKey = 'dark' | 'light' | 'system';

export const isThemeKey = (value: string | null): value is ThemeKey =>
    value === 'light' || value === 'dark' || value === 'system';

export const createMonitaTheme = (mode: PaletteMode) => {
    const dark = mode === 'dark';
    // Keep the interface anchored in Monita's blue/gray identity. Accent colors
    // support status and hierarchy instead of competing with the primary palette.
    const border = dark ? '#2A3948' : '#D5DEE8';
    const softBorder = dark ? '#202D39' : '#E7EDF3';
    const canvas = dark ? '#0B121A' : '#F4F7FA';
    const paper = dark ? '#111B26' : '#FFFFFF';
    const raised = dark ? '#162331' : '#F8FAFC';

    const base = createTheme({
        palette: {
            mode,
            primary: {
                main: '#1976D2',
                light: '#5AA2E8',
                dark: '#0F5BA8',
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: '#64748B',
                light: '#94A3B8',
                dark: '#475569',
                contrastText: '#FFFFFF',
            },
            info: {main: '#3498DB'},
            success: {main: '#16865B'},
            warning: {main: '#C98318'},
            error: {main: '#C84A55'},
            background: {default: canvas, paper},
            text: dark
                ? {primary: '#EDF3F8', secondary: '#9BAABB'}
                : {primary: '#17212B', secondary: '#607080'},
            divider: border,
        },
        shape: {borderRadius: 10},
        typography: {
            fontFamily:
                'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            h4: {fontWeight: 780, letterSpacing: '-0.035em'},
            h5: {fontWeight: 760, letterSpacing: '-0.025em'},
            h6: {fontWeight: 730, letterSpacing: '-0.018em'},
            subtitle1: {fontWeight: 680},
            button: {textTransform: 'none', fontWeight: 700, letterSpacing: '-0.01em'},
            body2: {lineHeight: 1.55},
            overline: {fontWeight: 760, letterSpacing: '0.09em'},
        },
    });

    return createTheme(base, {
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    html: {
                        backgroundColor: canvas,
                        colorScheme: mode,
                    },
                    body: {
                        backgroundColor: canvas,
                        backgroundImage: 'none',
                        scrollbarColor: dark ? '#425466 transparent' : '#AAB8C6 transparent',
                    },
                    '::selection': {
                        backgroundColor: alpha(base.palette.primary.main, dark ? 0.32 : 0.2),
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: 'none',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                    outlined: {
                        borderColor: border,
                        boxShadow: dark
                            ? '0 14px 34px rgba(0, 0, 0, 0.18)'
                            : '0 12px 30px rgba(35, 55, 80, 0.07)',
                    },
                },
            },
            MuiButton: {
                defaultProps: {disableElevation: true},
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        minHeight: 38,
                        paddingInline: 15,
                    },
                    contained: {
                        boxShadow: 'none',
                    },
                    outlined: {
                        borderColor: border,
                        backgroundColor: alpha(paper, 0.74),
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        fontWeight: 700,
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        backgroundColor: raised,
                    },
                    notchedOutline: {
                        borderColor: border,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {borderBottomColor: softBorder},
                    head: {
                        color: base.palette.text.secondary,
                        fontSize: '0.74rem',
                        fontWeight: 760,
                        textTransform: 'uppercase',
                        letterSpacing: '0.075em',
                        backgroundColor: raised,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 12,
                        border: `1px solid ${border}`,
                        boxShadow: dark
                            ? '0 24px 80px rgba(0,0,0,.46)'
                            : '0 24px 80px rgba(31,48,74,.18)',
                    },
                },
            },
            MuiMenu: {
                defaultProps: {elevation: 0},
                styleOverrides: {
                    paper: {
                        border: `1px solid ${border}`,
                        borderRadius: 10,
                        minWidth: 220,
                        boxShadow: dark
                            ? '0 18px 50px rgba(0,0,0,.38)'
                            : '0 18px 50px rgba(31,48,74,.14)',
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        '&.Mui-selected': {
                            backgroundColor: alpha(base.palette.primary.main, dark ? 0.16 : 0.09),
                        },
                    },
                },
            },
            MuiTooltip: {
                defaultProps: {arrow: true, enterDelay: 400},
            },
        },
    });
};
