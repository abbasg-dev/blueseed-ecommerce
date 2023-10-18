import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useMutation } from 'react-query';
import { LoginService } from 'api/services/login.services';
import { login } from 'store/slices/authSlice'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import { ReactComponent as LoginImage } from 'assets/images/login.svg';
import logo from 'assets/images/logo.png';
import { StyledImage } from './login.style';
import { NavLink as RouterLink } from 'react-router-dom';
import * as ROUTES from 'constants/routes'

const Login = () => {

    const dispatch = useDispatch()

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false)

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    const mutation = useMutation(() => LoginService(username, password),
        {
            onSuccess(response) {
                const { accessToken, idToken, refreshToken } = (response)
                localStorage.setItem("ecommerceTokens", JSON.stringify({ accessToken, idToken, refreshToken, creationDate: new Date() }))
                dispatch(login())
            },
            onError() {
                setIsError(true)
                setOpenNotification(true)
            },
        }
    )

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setIsError(false)
        mutation.mutate()
    }

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gridTemplateRows: { xs: '120px 1fr', md: '1fr' } }}>
                <Stack sx={{ bgcolor: (theme) => alpha(theme.palette.info.main, 0.38), position: 'relative', overflow: 'hidden' }} alignItems="center" justifyContent="center">
                    <StyledImage src={logo} alt='' />
                    <Box sx={{
                        position: 'absolute',
                        left: { xs: 'auto', md: '50%' },
                        transform: { xs: 'scaleY(-1)', md: 'translateX(-50%)' },
                        width: { xs: '48%', md: '90%' },
                        bottom: { xs: 'auto', md: '-4px' },
                        right: { xs: '6px', md: 'auto' },
                        top: { xs: '-4px', md: 'auto' }
                    }}
                    >
                        <LoginImage width="100%" />
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        left: { xs: '6px', md: '50%' },
                        transform: { xs: 'scaleY(-1)', md: 'translateX(-50%)scaleY(-1)' },
                        width: { xs: '48%', md: '90%' },
                        top: '-4px'
                    }}
                    >
                        <LoginImage width="100%" />
                    </Box>
                </Stack>
                <Stack alignItems="center" justifyContent={{ xs: 'normal', md: 'center' }} px={{ xs: 2, md: "15%" }} pt={{ xs: 3, md: 0 }} pb={{ xs: 8, md: 0 }} component="form" onSubmit={onSubmit}>
                    <Typography variant="h3" mb={4}>
                        Log in to start
                    </Typography>
                    <Divider flexItem sx={{ mb: 2, display: { xs: 'none', md: 'block' } }} />
                    <InputLabel sx={{ color: "common.black", alignSelf: "start", mb: 1.75, mt: { xs: 'auto', md: 0 } }} htmlFor="username">
                        User name
                    </InputLabel>
                    <TextField variant="outlined" fullWidth placeholder='Enter user name' sx={{ mb: 3 }} id="username"
                        onChange={handleUsernameChange} value={username} required autoComplete='username' error={isError}
                    />
                    <InputLabel sx={{ color: "common.black", alignSelf: "start", mb: 1.75 }} htmlFor="password">
                        Password
                    </InputLabel>
                    <TextField type="password" variant="outlined" fullWidth placeholder='Enter password' sx={{ mb: 2 }} id="password"
                        onChange={handlePasswordChange} value={password} required autoComplete='current-password' error={isError}
                    />
                    <Typography variant='body2' sx={{ alignSelf: 'flex-start' }} mb={3}>
                        By logging in, you agree to our <Link href="#" underline="hover" color="info.main">Conditions of Use</Link> & <Link href="#" underline="hover" color="info.main">Privacy Notice</Link>.
                    </Typography>
                    <Button variant="contained" type='submit' size="large" sx={{ width: "200px", height: "52px", borderRadius: "50px", mb: 2 }}>
                        Log in
                    </Button>
                    <Button variant="contained" type='button' size="large" color="secondary" disableElevation
                        component={RouterLink} to={ROUTES.HOME}
                        sx={{ width: '200px', height: "52px", borderRadius: "50px", mb: 3, bgcolor: 'grey.200', color: 'grey.700', "&:hover": { bgcolor: "grey.300" } }}>
                        Cancel
                    </Button>
                    <Typography variant='subtitle2'>
                        Don’t have an account? <Link component={RouterLink} to={`/${ROUTES.CONTACT}`} underline="hover" color="primary.main">Contact us</Link>
                    </Typography>
                </Stack>
            </Box >
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Login Failed
                </Alert>
            </Snackbar>
        </>
    )
}

export default Login;