import { createTheme, PaletteOptions } from "@mui/material"

const palette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#ffcd00',
    contrastText: '#242526'
  },
  background: {
    default: '#242526',
  },
}

export const theme = createTheme({
  palette
})