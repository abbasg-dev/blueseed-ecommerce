import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { ReactComponent as FacebookIcon } from 'assets/icons/facebook.svg';
import { ReactComponent as TwitterIcon } from 'assets/icons/twitter.svg';
import { ReactComponent as InstaIcon } from 'assets/icons/instagram.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { NavLink as RouterLink } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { StyledLogo, StyledWave } from './footer.style';


const Footer = () => {

    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box component="footer" sx={{ py: 4, px: { xs: 4, md: 14 }, borderTop: "1px solid", borderColor: "grey.400", position: "relative", overflow: "hidden" }}>
            <Grid container spacing={1} py={4}>
                <Grid item xs={12} md={4} textAlign="center">
                    <StyledLogo width={332} height={83} />
                </Grid>
                <Grid item xs={12} md={4} >
                    <Stack alignItems="center">
                        <Box>
                            <Button
                                variant="text"
                                endIcon={<ArrowIcon />}
                                sx={{ color: "common.black", mb: 1 }}
                                component={RouterLink} to={ROUTES.CONTACT}
                            >
                                Contact us
                            </Button>
                            <Typography variant="body2" color="secondary" sx={{ maxWidth: "280px", px: 1 }}>
                                Keep in touch by sending message and give us a follow
                            </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 4, width: "100%" }}>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'customGreen.main' }}>
                                    <FacebookIcon width={6} height={10} />
                                </Avatar>
                            </IconButton>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'customGreen.main' }}>
                                    <TwitterIcon width={11} height={8} />
                                </Avatar>
                            </IconButton>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'customGreen.main' }}>
                                    <InstaIcon width={11} height={11} />
                                </Avatar>
                            </IconButton>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={15} component="nav" mt={1} justifyContent="center">
                        <Box>
                            <Typography variant="subtitle2">
                                Menu
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Home
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                My orders
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ visibility: "hidden" }}>
                                Menu
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                New order
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                RMA
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
            <Divider sx={{ mx: -14, mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'normal', md: 'center' }} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Terms & conditions
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Settings
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.5, flex: { xs: "1 0 100%", md: "0 0 auto" }, ml: isMdOrLess ? "0!important" : "" }}>
                    © {new Date().getFullYear()} Blueseed
                </Typography>
            </Stack>
            <StyledWave />
        </Box >
    )
}

export default Footer