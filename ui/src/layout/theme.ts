import {alpha, createTheme, PaletteMode} from '@mui/material/styles';

// Monita 1.4.0 workspace design system.

export type ThemeKey = 'dark' | 'light' | 'system';

export const isThemeKey = (value: string | null): value is ThemeKey =>
    value === 'light' || value === 'dark' || value === 'system';

export const createMonitaTheme = (mode: PaletteMode) => {
    const dark = mode === 'dark';
    const canvas = dark ? '#0B0D12' : '#F5F5F2';
    const panel = dark ? '#11141A' : '#FFFFFF';
    const panelAlt = dark ? '#171A21' : '#F0F0EC';
    const border = dark ? '#2A2E37' : '#D7D7D1';
    const text = dark ? '#F3F4F6' : '#171717';
    const muted = dark ? '#9CA3AF' : '#666A70';
    const accent = dark ? '#A78BFA' : '#6D28D9';

    const base = createTheme({
        palette: {
            mode,
            primary: {main: accent, contrastText: '#FFFFFF'},
            secondary: {main: dark ? '#5EEAD4' : '#0F766E'},
            success: {main: dark ? '#34D399' : '#047857'},
            warning: {main: dark ? '#FBBF24' : '#B45309'},
            error: {main: dark ? '#FB7185' : '#BE123C'},
            info: {main: dark ? '#67E8F9' : '#0E7490'},
            background: {default: canvas, paper: panel},
            text: {primary: text, secondary: muted},
            divider: border,
        },
        shape: {borderRadius: 4},
        typography: {
            fontFamily:
                'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            h3: {fontWeight: 760, letterSpacing: '-0.04em'},
            h4: {fontWeight: 750, letterSpacing: '-0.035em'},
            h5: {fontWeight: 730, letterSpacing: '-0.025em'},
            h6: {fontWeight: 710, letterSpacing: '-0.015em'},
            subtitle1: {fontWeight: 700},
            button: {textTransform: 'none', fontWeight: 700, letterSpacing: 0},
            body2: {lineHeight: 1.5},
            overline: {fontWeight: 760, letterSpacing: '0.11em', fontSize: '0.66rem'},
        },
    });

    return createTheme(base, {
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    html: {backgroundColor: canvas},
                    body: {
                        backgroundColor: canvas,
                        color: text,
                        backgroundImage: 'none',
                        scrollbarColor: dark ? '#4B5563 transparent' : '#B8B8B0 transparent',
                    },
                    a: {
                        color: 'inherit',
                        textDecorationColor: 'currentColor',
                        textUnderlineOffset: '0.18em',
                    },
                    'a:hover': {
                        color: 'inherit',
                    },
                    '::selection': {
                        backgroundColor: alpha(accent, 0.22),
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {backgroundImage: 'none'},
                    outlined: {borderColor: border, boxShadow: 'none'},
                },
            },
            MuiAppBar: {
                styleOverrides: {root: {backgroundImage: 'none', boxShadow: 'none'}},
            },
            MuiButton: {
                defaultProps: {disableElevation: true},
                styleOverrides: {
                    root: {
                        borderRadius: 3,
                        minHeight: 36,
                        paddingInline: 13,
                    },
                    contained: {boxShadow: 'none'},
                    outlined: {borderColor: border, backgroundColor: 'transparent'},
                    text: {
                        '&:hover': {backgroundColor: alpha(accent, dark ? 0.10 : 0.06)},
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {borderRadius: 3},
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        height: 25,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 3,
                        backgroundColor: panel,
                    },
                    notchedOutline: {borderColor: border},
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {fontSize: '0.9rem'},
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {borderBottomColor: border},
                    head: {
                        color: muted,
                        fontSize: '0.69rem',
                        fontWeight: 760,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        backgroundColor: panelAlt,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 5,
                        border: `1px solid ${border}`,
                        boxShadow: dark
                            ? '0 24px 70px rgba(0,0,0,.50)'
                            : '0 24px 70px rgba(0,0,0,.16)',
                    },
                },
            },
            MuiMenu: {
                defaultProps: {elevation: 0},
                styleOverrides: {
                    paper: {
                        border: `1px solid ${border}`,
                        borderRadius: 4,
                        minWidth: 210,
                        boxShadow: dark
                            ? '0 16px 40px rgba(0,0,0,.40)'
                            : '0 16px 40px rgba(0,0,0,.12)',
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        '&.Mui-selected': {backgroundColor: alpha(accent, dark ? 0.14 : 0.08)},
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        textTransform: 'none',
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {borderRadius: 3},
                },
            },
            MuiTooltip: {
                defaultProps: {arrow: true, enterDelay: 350},
            },
        },
    });
};
