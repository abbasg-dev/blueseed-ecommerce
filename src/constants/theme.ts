import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export let theme = createTheme({
    palette: {
        primary: {
            main: "#347AE6"
        },
        secondary: {
            main: "#8A8A8A"
        },
        success: {
            main: '#86F077'
        },
        info: {
            main: "#52cbff"
        },
        error: {
            main: "#EB1E4B"
        },
        customGreen: {
            main: "#66B95A"
        },
        customYellow: {
            main: "#FFE070"
        },
        customOrange: {
            main: "#FFA844"
        },
        customGrey: {
            main: "#F5F7FF",
            dark: "#090038"
        },
        grey: {
            600: "#737B7D"
        }
    },
    typography: {
        fontFamily: [
            'Poppins', 'Helvetica', 'Arial', 'sans-serif'
        ].join(','),
        button: {
            textTransform: 'none',

        }
    }
});

theme = responsiveFontSizes(theme);