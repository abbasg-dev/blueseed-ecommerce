import { styled } from '@mui/material/styles';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import { ReactComponent as WaveImage } from 'assets/images/footer-wave.svg';

export const StyledLogo = styled(Logo)(({ theme }) => ({
    height: 'auto',
    maxWidth: '90%',
    [theme.breakpoints.up('md')]: {
        width: '332px',
        height: '83px'
    },
}))

export const StyledWave = styled(WaveImage)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    width: '100%',
    zIndex: '-1',
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',
        bottom: 0,
    },
    [theme.breakpoints.up('lg')]: {
        top: 0
    },
}))
