import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import Dashboard from '@mui/icons-material/Dashboard';
import Inbox from '@mui/icons-material/Inbox';
import Forum from '@mui/icons-material/Forum';
import People from '@mui/icons-material/People';
import GroupWork from '@mui/icons-material/GroupWork';
import FactCheck from '@mui/icons-material/FactCheck';
import DevicesOther from '@mui/icons-material/DevicesOther';
import Extension from '@mui/icons-material/Extension';
import Settings from '@mui/icons-material/Settings';
import Hub from '@mui/icons-material/Hub';
import AutoMode from '@mui/icons-material/AutoMode';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Public from '@mui/icons-material/Public';
import NotificationsOff from '@mui/icons-material/NotificationsOff';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import {Link, useLocation} from 'react-router';
import {observer} from 'mobx-react-lite';
import {mayAllowPermission, requestPermission} from '../snack/browserNotification';
import {useStores} from '../stores';
import * as config from '../config';

export const navigationWidth = 288;

interface IProps {
    loggedIn: boolean;
    navOpen: boolean;
    setNavOpen: (open: boolean) => void;
}

interface NavItem {
    label: string;
    to: string;
    icon: React.ReactNode;
    exact?: boolean;
    adminOnly?: boolean;
}

const Navigation = observer(({loggedIn, navOpen, setNavOpen}: IProps) => {
    const location = useLocation();
    const {appStore, currentUser} = useStores();
    const apps = appStore.getItems();
    const chatApps = apps.filter(
        (app) =>
            app.channelType === 'chat' || (app.channelType == null && Boolean(app.allowMemberPost))
    );
    const notificationApps = apps.filter(
        (app) =>
            !(
                app.channelType === 'chat' ||
                (app.channelType == null && Boolean(app.allowMemberPost))
            )
    );
    const [showRequestNotification, setShowRequestNotification] =
        React.useState(mayAllowPermission);

    const primaryItems: NavItem[] = [
        {label: 'Home', to: '/', icon: <Dashboard />, exact: true},
        {label: 'Messages', to: '/messages', icon: <Inbox />},
        {label: 'Channels', to: '/channels', icon: <Forum />},
    ];

    const workspaceItems: NavItem[] = [
        {label: 'Clients', to: '/clients', icon: <DevicesOther />},
        {label: 'Plugins', to: '/plugins', icon: <Extension />},
        {label: 'Settings', to: '/settings', icon: <Settings />},
    ];

    const adminItems: NavItem[] = [
        {label: 'Users', to: '/users', icon: <People />, adminOnly: true},
        {label: 'Groups', to: '/groups', icon: <GroupWork />, adminOnly: true},
        {label: 'Integrations', to: '/integrations', icon: <Hub />, adminOnly: true},
        {label: 'Automation', to: '/automation', icon: <AutoMode />, adminOnly: true},
        {label: 'Security & Operations', to: '/system', icon: <AdminPanelSettings />, adminOnly: true},
        {label: 'Audit Log', to: '/audit', icon: <FactCheck />, adminOnly: true},
    ];

    const selected = (item: NavItem) =>
        item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

    const renderNavGroup = (label: string, items: NavItem[]) => (
        <Box sx={{mb: 1.5}}>
            <Typography
                variant="overline"
                color="text.secondary"
                sx={{display: 'block', px: 1.25, mb: 0.35}}>
                {label}
            </Typography>
            <List disablePadding>
                {items
                    .filter((item) => !item.adminOnly || currentUser.user.admin)
                    .map((item) => (
                        <ListItemButton
                            key={item.to}
                            id={
                                item.to === '/channels'
                                    ? 'navigate-apps'
                                    : item.to === '/users'
                                      ? 'navigate-users'
                                      : item.to === '/clients'
                                        ? 'navigate-clients'
                                        : item.to === '/plugins'
                                          ? 'navigate-plugins'
                                          : item.to === '/messages'
                                            ? 'navigate-messages'
                                            : undefined
                            }
                            className={item.to === '/messages' ? 'all' : undefined}
                            component={Link}
                            to={item.to}
                            selected={selected(item)}
                            disabled={!loggedIn}
                            onClick={() => setNavOpen(false)}
                            sx={{
                                minHeight: 42,
                                borderRadius: 0.75,
                                my: 0.15,
                                px: 1.1,
                                '&.Mui-selected': {
                                    bgcolor: 'action.selected',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': {color: 'primary.main'},
                                    '& .MuiListItemText-primary': {fontWeight: 760},
                                },
                            }}>
                            <ListItemIcon sx={{minWidth: 38}}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                slotProps={{primary: {fontSize: '0.9rem'}}}
                            />
                        </ListItemButton>
                    ))}
            </List>
        </Box>
    );

    const renderChannelSection = (
        label: string,
        sectionApps: typeof apps,
        icon: React.ReactNode
    ) => (
        <Box sx={{mb: 1.25}}>
            <Stack
                direction="row"
                sx={{px: 1.25, mb: 0.35, alignItems: 'center', justifyContent: 'space-between'}}>
                <Stack direction="row" spacing={0.65} sx={{alignItems: 'center'}}>
                    <Box sx={{display: 'flex', color: 'text.secondary'}}>{icon}</Box>
                    <Typography variant="caption" color="text.secondary" sx={{fontWeight: 750}}>
                        {label}
                    </Typography>
                </Stack>
                <Typography variant="caption" color="text.disabled">
                    {sectionApps.length}
                </Typography>
            </Stack>
            <List disablePadding>
                {loggedIn && sectionApps.length === 0 && (
                    <ListItemButton disabled sx={{borderRadius: 0.75, py: 0.5}}>
                        <ListItemText
                            primary={`No ${label.toLowerCase()}`}
                            slotProps={{primary: {fontSize: '0.82rem'}}}
                        />
                    </ListItemButton>
                )}
                {loggedIn &&
                    sectionApps.map((app) => {
                        const to = `/channels/${app.id}`;
                        return (
                            <ListItemButton
                                key={app.id}
                                className="item channel-shortcut"
                                component={Link}
                                to={to}
                                selected={location.pathname === to}
                                onClick={() => setNavOpen(false)}
                                sx={{
                                    borderRadius: 0.75,
                                    my: 0.1,
                                    py: 0.45,
                                    px: 0.85,
                                    '&.Mui-selected': {
                                        bgcolor: 'action.selected',
                                        '& .MuiListItemText-primary': {fontWeight: 750},
                                    },
                                }}>
                                <ListItemAvatar sx={{minWidth: 38}}>
                                    <Avatar
                                        src={config.get('url') + app.image}
                                        variant="square"
                                        sx={{width: 28, height: 28}}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="body2" noWrap>{app.name}</Typography>}
                                    secondary={
                                        app.receiveNotifications === false
                                            ? 'Muted'
                                            : undefined
                                    }
                                    slotProps={{secondary: {noWrap: true, fontSize: '0.7rem'}}}
                                />
                                <Stack direction="row" spacing={0.4} sx={{alignItems: 'center'}}>
                                    {app.receiveNotifications === false && (
                                        <NotificationsOff sx={{fontSize: 14, color: 'text.disabled'}} />
                                    )}
                                    {app.autoAssign && (
                                        <Public sx={{fontSize: 14, color: 'text.secondary'}} />
                                    )}
                                </Stack>
                            </ListItemButton>
                        );
                    })}
            </List>
        </Box>
    );

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
            }}>
            <Box sx={{display: {xs: 'flex', sm: 'none'}, justifyContent: 'flex-end', p: 1}}>
                <IconButton aria-label="Close navigation" onClick={() => setNavOpen(false)}>
                    <Close />
                </IconButton>
            </Box>

            <Box sx={{px: 1.25, pt: {xs: 0.5, sm: 1.5}, pb: 0.75}}>
                {renderNavGroup('Workspace', primaryItems)}
            </Box>

            <Divider />

            <Box sx={{px: 1.25, py: 1.25, flex: 1, minHeight: 0, overflowY: 'auto'}}>
                <Stack
                    direction="row"
                    sx={{px: 1.25, mb: 0.75, alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="overline" color="text.secondary">
                        Channels
                    </Typography>
                    <Chip size="small" variant="outlined" label={apps.length} />
                </Stack>
                {renderChannelSection('Chats', chatApps, <Forum sx={{fontSize: 15}} />)}
                {renderChannelSection(
                    'Notifications',
                    notificationApps,
                    <NotificationsActive sx={{fontSize: 15}} />
                )}

                <Divider sx={{my: 1.5}} />
                {currentUser.user.admin && renderNavGroup('Administration', adminItems)}
                {renderNavGroup('Tools', workspaceItems)}
            </Box>

            {showRequestNotification && (
                <Box sx={{p: 1.25, borderTop: 1, borderColor: 'divider'}}>
                    <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={() => {
                            requestPermission();
                            setShowRequestNotification(false);
                        }}>
                        Enable notifications
                    </Button>
                </Box>
            )}
        </Box>
    );

    return (
        <>
            <Drawer
                open={navOpen}
                onClose={() => setNavOpen(false)}
                variant="temporary"
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {width: navigationWidth},
                }}>
                {drawerContent}
            </Drawer>
            <Drawer
                id="message-navigation"
                variant="permanent"
                open
                sx={{
                    display: {xs: 'none', sm: 'block'},
                    width: navigationWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: navigationWidth,
                        boxSizing: 'border-box',
                        position: 'relative',
                        height: '100%',
                        borderRightStyle: 'solid',
                        borderRightColor: 'divider',
                    },
                }}>
                {drawerContent}
            </Drawer>
        </>
    );
});

export default Navigation;
