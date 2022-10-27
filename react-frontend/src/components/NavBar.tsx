import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DriveEtaIcon from '@mui/icons-material/DriveEta';

export default function NavBar() {
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton edge='start' color='inherit' aria-label="menu">
          <DriveEtaIcon />
        </IconButton>
        <Typography variant='h6'>Code delivery</Typography>
      </Toolbar>
    </AppBar>
  )
}