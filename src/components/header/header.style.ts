import { styled } from '@mui/material/styles';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import { ReactComponent as CoinIcon } from 'assets/icons/coin.svg';

export const StyledLogo = styled(Logo)(({ theme }) => ({
    width: '86px',
    [theme.breakpoints.up('md')]: {
        width: 'auto',
    },
}))

export const StyledCoin = styled(CoinIcon)(({ theme }) => ({
    width: '16px',
    [theme.breakpoints.up('md')]: {
        width: 'auto',
    },
}))