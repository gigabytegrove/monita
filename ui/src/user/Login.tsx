import React from 'react';
import {Box, Button, Divider, Stack, TextField, Typography} from '@mui/material';
import * as config from '../config';
import RegistrationDialog from './Register';
import {useStores} from '../stores';
import {observer} from 'mobx-react-lite';
import {useNavigate, useSearchParams} from 'react-router';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Key from '@mui/icons-material/Key';

const Login = observer(() => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [mfaCode, setMfaCode] = React.useState('');
    const [mfaRequired, setMfaRequired] = React.useState(false);
    const [registerDialog, setRegisterDialog] = React.useState(false);
    const {currentUser} = useStores();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const localAuthEnabled = config.get('localAuth');
    const oidcEnabled = config.get('oidc');
    const oidcIdpName = config.get('oidcIdpName');
    const ldapEnabled = config.get('ldap');
    const ldapIdpName = config.get('ldapIdpName');

    const oidcAutoRedirect =
        oidcEnabled &&
        config.get('oidcAutoRedirect') &&
        searchParams.get('redirect') !== 'false' &&
        !currentUser.connectionErrorMessage;

    const oidcLoginUrl =
        config.get('url') +
        'auth/oidc/login?name=' +
        encodeURIComponent(currentUser.createClientName());

    React.useEffect(() => {
        if (currentUser.loggedIn) {
            navigate('/');
            return;
        }
        if (!currentUser.authenticating && oidcAutoRedirect) {
            window.location.href = oidcLoginUrl;
        }
    }, [
        currentUser.loggedIn,
        currentUser.authenticating,
        navigate,
        oidcAutoRedirect,
        oidcLoginUrl,
    ]);

    const login = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await currentUser.login(username, password, mfaCode);
        if (result.mfaRequired) setMfaRequired(true);
    };

    const authMethods = [
        localAuthEnabled ? 'Local' : '',
        ldapEnabled ? ldapIdpName : '',
        oidcEnabled ? oidcIdpName : '',
    ].filter(Boolean);

    return (
        <Box
            sx={{
                minHeight: 'calc(100dvh - 110px)',
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', lg: 'minmax(320px, 0.9fr) minmax(420px, 1.1fr)'},
                maxWidth: 1080,
                mx: 'auto',
                border: {lg: 1},
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
            <Box
                sx={{
                    p: {xs: 3, sm: 5, lg: 6},
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: 'background.default',
                    borderRight: {lg: 1},
                    borderColor: 'divider',
                    minHeight: {lg: 620},
                }}>
                <Box>
                    <Box
                        component="img"
                        src={config.get('url') + 'static/monita-logo.svg?v=1.3.9-alpha'}
                        alt="Monita"
                        sx={{width: 190, maxWidth: '75%', mb: 5}}
                    />
                    <Typography variant="h3" sx={{fontSize: {xs: '2rem', sm: '2.6rem'}}}>
                        Notifications without the noise.
                    </Typography>
                    <Typography color="text.secondary" sx={{mt: 2, maxWidth: 430}}>
                        Operational alerts, team conversations, automation, and delivery controls in
                        one self-hosted workspace.
                    </Typography>
                </Box>
                <Box sx={{mt: 5}}>
                    <Typography variant="overline" color="text.secondary">
                        Server
                    </Typography>
                    <Typography variant="body2" sx={{mt: 0.5}}>
                        Monita @{config.get('version').version}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {authMethods.length > 0
                            ? authMethods.join(' · ')
                            : 'Authentication configured by your administrator'}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{p: {xs: 3, sm: 5, lg: 6}, display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', maxWidth: 430, mx: 'auto'}}>
                    <Typography variant="overline" color="primary.main">
                        Account access
                    </Typography>
                    <Typography variant="h4" sx={{mt: 0.5}}>
                        Sign in
                    </Typography>
                    <Typography color="text.secondary" sx={{mt: 0.75, mb: 3}}>
                        Continue to your Monita workspace.
                    </Typography>

                    <Stack spacing={2}>
                        {localAuthEnabled && (
                            <Box component="form" id="login-form" onSubmit={login}>
                                <Stack spacing={1.5}>
                                    <TextField
                                        autoFocus
                                        id="username"
                                        className="name"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        id="password"
                                        type="password"
                                        className="password"
                                        label="Password"
                                        name="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        fullWidth
                                    />
                                    {mfaRequired && (
                                        <TextField
                                            autoFocus
                                            id="mfa-code"
                                            label="Verification code"
                                            value={mfaCode}
                                            onChange={(event) => setMfaCode(event.target.value)}
                                            autoComplete="one-time-code"
                                            helperText="Authenticator code or recovery code."
                                            fullWidth
                                        />
                                    )}
                                    <Button
                                        type="submit"
                                        startIcon={<LockOutlined />}
                                        variant="contained"
                                        size="large"
                                        className="login"
                                        disabled={
                                            Boolean(currentUser.connectionErrorMessage) ||
                                            currentUser.authenticating
                                        }
                                        loading={currentUser.authenticating}
                                        fullWidth>
                                        Sign In
                                    </Button>
                                </Stack>
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<Key />}
                            disabled={
                                !username ||
                                Boolean(currentUser.connectionErrorMessage) ||
                                currentUser.authenticating
                            }
                            onClick={() => void currentUser.loginPasskey(username)}>
                            Sign in with Passkey
                        </Button>

                        {ldapEnabled && (
                            <>
                                {localAuthEnabled && <Divider>or</Divider>}
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    disabled={
                                        !username ||
                                        !password ||
                                        Boolean(currentUser.connectionErrorMessage) ||
                                        currentUser.authenticating
                                    }
                                    onClick={() => void currentUser.loginDirectory(username, password)}>
                                    Sign in with {ldapIdpName}
                                </Button>
                            </>
                        )}

                        {oidcEnabled && (
                            <>
                                {(localAuthEnabled || ldapEnabled) && <Divider>or</Divider>}
                                <Button
                                    id="oidc-login"
                                    component="a"
                                    href={oidcLoginUrl}
                                    variant="outlined"
                                    size="large"
                                    fullWidth>
                                    Sign in with {oidcIdpName}
                                </Button>
                            </>
                        )}

                        {localAuthEnabled && config.get('register') && (
                            <Button id="register" variant="text" onClick={() => setRegisterDialog(true)}>
                                Create an account
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Box>

            {registerDialog && (
                <RegistrationDialog
                    fClose={() => setRegisterDialog(false)}
                    fOnSubmit={currentUser.register}
                />
            )}
        </Box>
    );
});

export default Login;
