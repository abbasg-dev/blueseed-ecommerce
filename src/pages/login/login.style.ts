import { styled } from '@mui/material/styles';

export const StyledImage = styled('img')(({ theme }) => ({
    width: '175px',
    paddingTop: '30px',
    [theme.breakpoints.up('md')]: {
        width: 'auto',
        paddingTop: 0
    },
}))

