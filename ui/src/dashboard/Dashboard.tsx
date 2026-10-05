import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import NotificationsOff from '@mui/icons-material/NotificationsOff';
import Public from '@mui/icons-material/Public';
import People from '@mui/icons-material/People';
import DevicesOther from '@mui/icons-material/DevicesOther';
import Extension from '@mui/icons-material/Extension';
import Security from '@mui/icons-material/Security';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Inbox from '@mui/icons-material/Inbox';
import Settings from '@mui/icons-material/Settings';
import Forum from '@mui/icons-material/Forum';
import GroupWork from '@mui/icons-material/GroupWork';
import FactCheck from '@mui/icons-material/FactCheck';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import {Link} from 'react-router';
import {observer} from 'mobx-react-lite';
import DefaultPage from '../common/DefaultPage';
import StatCard from '../common/StatCard';
import SurfaceCard from '../common/SurfaceCard';
import {useStores} from '../stores';
import * as config from '../config';
import {UpdateAvailableBanner} from '../update/UpdateStatus';

const Dashboard = observer(() => {
    const {appStore, userStore, clientStore, pluginStore, groupStore, currentUser} = useStores();
    const admin = currentUser.user.admin;

    React.useEffect(() => {
        void appStore.refresh();
        void clientStore.refresh();
        void pluginStore.refresh();
        if (admin) {
            void userStore.refresh();
            void groupStore.refresh();
        }
    }, [admin, appStore, clientStore, pluginStore, userStore, groupStore]);

    const apps = appStore.getItems();
    const globals = apps.filter((app) => app.autoAssign).length;
    const muted = apps.filter((app) => app.receiveNotifications === false).length;
    const clients = clientStore.getItems();
    const plugins = pluginStore.getItems();
    const enabledPlugins = plugins.filter((plugin) => plugin.enabled).length;
    const users = admin ? userStore.getItems() : [];
    const groups = admin ? groupStore.getItems() : [];
    const version = config.get('version');

    const recentApps = [...apps]
        .sort((a, b) => {
            if (!a.lastUsed && !b.lastUsed) return 0;
            if (!a.lastUsed) return 1;
            if (!b.lastUsed) return -1;
            return Date.parse(b.lastUsed) - Date.parse(a.lastUsed);
        })
        .slice(0, 7);

    return (
        <DefaultPage
            eyebrow="Workspace"
            title="Good to see you."
            description="Your Monita workspace, recent activity, and system health in one place."
            rightControl={
                <Stack direction="row" spacing={1}>
                    <Button component={Link} to="/channels" variant="outlined" startIcon={<AddCircleOutline />}>
                        Channels
                    </Button>
                    <Button component={Link} to="/messages" variant="contained" startIcon={<Inbox />}>
                        Messages
                    </Button>
                </Stack>
            }>
            {admin && <UpdateAvailableBanner />}

            <Paper
                elevation={0}
                sx={{
                    p: {xs: 2, md: 2.5},
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                }}>
                <Grid container spacing={2} sx={{alignItems: 'center'}}>
                    <Grid size={{xs: 12, lg: 7}}>
                        <Stack spacing={0.75}>
                            <Stack direction="row" spacing={1} sx={{alignItems: 'center', flexWrap: 'wrap'}}>
                                <Chip
                                    size="small"
                                    color={currentUser.connectionErrorMessage ? 'warning' : 'success'}
                                    label={currentUser.connectionErrorMessage ? 'Connection attention needed' : 'Server connected'}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Monita @{version.version}
                                </Typography>
                            </Stack>
                            <Typography variant="h5">
                                {currentUser.user.displayName || currentUser.user.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {admin
                                    ? 'Administrator access · full workspace controls available'
                                    : 'Standard workspace access'}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{xs: 12, lg: 5}}>
                        <Grid container spacing={1}>
                            <Grid size={{xs: 6}}>
                                <StatCard
                                    label="Channels"
                                    value={apps.length}
                                    helper={globals ? `${globals} global` : 'none global'}
                                    icon={<NotificationsActive />}
                                />
                            </Grid>
                            <Grid size={{xs: 6}}>
                                <StatCard
                                    label="Clients"
                                    value={clients.length}
                                    helper="authorized"
                                    icon={<DevicesOther />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2}>
                <Grid size={{xs: 12, lg: 8}}>
                    <SurfaceCard
                        title="Recent channels"
                        subtitle="Jump back into the places with the latest activity."
                        flush
                        action={
                            <Button component={Link} to="/channels" size="small" endIcon={<ArrowForward />}>
                                All channels
                            </Button>
                        }>
                        <Box>
                            {recentApps.length === 0 ? (
                                <Box sx={{p: 4, textAlign: 'center'}}>
                                    <Typography variant="h6">No channels yet</Typography>
                                    <Typography color="text.secondary" sx={{mt: 0.5, mb: 2}}>
                                        Create your first notification or chat channel to get started.
                                    </Typography>
                                    <Button component={Link} to="/channels" variant="contained">
                                        Manage Channels
                                    </Button>
                                </Box>
                            ) : (
                                recentApps.map((app, index) => (
                                    <Box
                                        key={app.id}
                                        component={Link}
                                        to={`/channels/${app.id}`}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'auto minmax(0,1fr) auto',
                                            gap: 1.5,
                                            alignItems: 'center',
                                            px: {xs: 2, sm: 2.5},
                                            py: 1.45,
                                            color: 'inherit',
                                            textDecoration: 'none',
                                            borderBottom: index < recentApps.length - 1 ? 1 : 0,
                                            borderColor: 'divider',
                                            transition: 'background-color 120ms ease',
                                            '&:hover': {bgcolor: 'action.hover'},
                                        }}>
                                        <Avatar
                                            src={config.get('url') + app.image}
                                            variant="rounded"
                                            sx={{width: 42, height: 42}}
                                        />
                                        <Box sx={{minWidth: 0}}>
                                            <Stack direction="row" spacing={0.65} sx={{alignItems: 'center', flexWrap: 'wrap'}}>
                                                <Typography sx={{fontWeight: 750}} noWrap>
                                                    {app.name}
                                                </Typography>
                                                {app.autoAssign && <Public sx={{fontSize: 15, color: 'text.secondary'}} />}
                                                {app.receiveNotifications === false && (
                                                    <NotificationsOff sx={{fontSize: 15, color: 'text.secondary'}} />
                                                )}
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {app.description ||
                                                    (app.channelType === 'chat' || app.allowMemberPost
                                                        ? 'Chat channel'
                                                        : 'Notification channel')}
                                            </Typography>
                                        </Box>
                                        <ArrowForward sx={{fontSize: 18, color: 'text.secondary'}} />
                                    </Box>
                                ))
                            )}
                        </Box>
                    </SurfaceCard>
                </Grid>

                <Grid size={{xs: 12, lg: 4}}>
                    <Stack spacing={2}>
                        <SurfaceCard title="Workspace" subtitle="Common destinations." flush>
                            <Box>
                                <LaunchRow to="/messages" icon={<Inbox />} label="All messages" detail="Search and review activity" />
                                <LaunchRow to="/channels" icon={<Forum />} label="Channels" detail="Manage chat and notifications" />
                                {admin && (
                                    <>
                                        <LaunchRow to="/users" icon={<People />} label="Users" detail={`${users.length} accounts`} />
                                        <LaunchRow to="/groups" icon={<GroupWork />} label="Groups" detail={`${groups.length} groups`} />
                                        <LaunchRow to="/audit" icon={<FactCheck />} label="Audit" detail="Security and admin history" />
                                    </>
                                )}
                                <LaunchRow to="/settings" icon={<Settings />} label="Settings" detail="Account and notification preferences" last />
                            </Box>
                        </SurfaceCard>

                        <SurfaceCard title="System snapshot" subtitle="Current workspace inventory.">
                            <Grid container spacing={1.5}>
                                <Grid size={{xs: 6}}>
                                    <Snapshot label="Muted" value={muted} />
                                </Grid>
                                <Grid size={{xs: 6}}>
                                    <Snapshot label="Plugins" value={`${enabledPlugins}/${plugins.length}`} />
                                </Grid>
                                {admin && (
                                    <>
                                        <Grid size={{xs: 6}}>
                                            <Snapshot label="Users" value={users.length} />
                                        </Grid>
                                        <Grid size={{xs: 6}}>
                                            <Snapshot label="Groups" value={groups.length} />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Stack direction="row" spacing={1} sx={{mt: 2, alignItems: 'center'}}>
                                <Security sx={{fontSize: 18, color: 'text.secondary'}} />
                                <Typography variant="body2" color="text.secondary">
                                    {admin ? 'Administrator session' : 'Standard user session'}
                                </Typography>
                            </Stack>
                        </SurfaceCard>
                    </Stack>
                </Grid>
            </Grid>
        </DefaultPage>
    );
});

const LaunchRow = ({
    to,
    icon,
    label,
    detail,
    last = false,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
    detail: string;
    last?: boolean;
}) => (
    <Box
        component={Link}
        to={to}
        sx={{
            display: 'grid',
            gridTemplateColumns: '36px minmax(0,1fr) auto',
            gap: 1.25,
            alignItems: 'center',
            px: 2,
            py: 1.35,
            color: 'inherit',
            textDecoration: 'none',
            borderBottom: last ? 0 : 1,
            borderColor: 'divider',
            '&:hover': {bgcolor: 'action.hover'},
        }}>
        <Box sx={{display: 'grid', placeItems: 'center', color: 'primary.main'}}>{icon}</Box>
        <Box sx={{minWidth: 0}}>
            <Typography variant="body2" sx={{fontWeight: 750}}>
                {label}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
                {detail}
            </Typography>
        </Box>
        <ArrowForward sx={{fontSize: 17, color: 'text.disabled'}} />
    </Box>
);

const Snapshot = ({label, value}: {label: string; value: React.ReactNode}) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
    </Box>
);

export default Dashboard;
