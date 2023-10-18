import { styled, alpha } from '@mui/material/styles';
import { Swiper } from 'swiper/react'

export const StyledSwiper = styled(Swiper)(({ theme }) => ({
    height: '100%',
    '.swiper-slide': {
        backgroundColor: alpha(theme.palette.success.main, 0.5),
    },
    '.swiper-wave': {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 'auto'
    },
    '.swiper-button-prev': {
        left: '24px',
        transform: 'scale(0.3)',
        top: '80px',
        [theme.breakpoints.up('md')]: {
            left: '60px',
            transform: 'none',
            top: '50%'
        },
        color: theme.palette.common.black,
        fontWeight: 'bold'
    },
    '.swiper-button-next': {
        right: '24px',
        transform: 'scale(0.3)',
        top: '80px',
        [theme.breakpoints.up('md')]: {
            right: '60px',
            transform: 'none',
            top: '50%'
        },
        color: theme.palette.common.black,
        fontWeight: 'bold'
    },
    '.swiper-pagination': {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
        bottom: '54px!important',
        '&-bullet': {
            border: '1px solid',
            borderColor: theme.palette.grey[900],
            backgroundColor: theme.palette.grey[900],
            opacity: '1',
            width: '13px',
            height: '13px',
            '&-active': {
                backgroundColor: 'transparent'
            }
        }
    },
}))