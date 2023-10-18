import { ThemeOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {

    interface Palette {
        customGreen?: PaletteColor,
        customYellow?: PaletteColor,
        customGrey?: PaletteColor,
        customOrange?: PaletteColor,
    }
    interface PaletteOptions {
        customGreen?: PaletteColorOptions,
        customYellow?: PaletteColorOptions,
        customGrey?: PaletteColorOptions,
        customOrange?: PaletteColorOptions,
    }
}