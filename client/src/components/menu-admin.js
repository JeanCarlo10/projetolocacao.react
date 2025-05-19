import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';

import Logo from '../assets/img/logo-locacao-palmeiras.png';
import { mainListItems } from './list-menu-admin';
// import { getNameUser } from '../services/auth';

const drawerWidth = 240;

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#FFF',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MyDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    backgroundColor: "#FFF",
    borderRightWidth: 1,
    borderColor: '#dedede',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(open ? {} : {
      overflowX: 'hidden',
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  },
}));

const ToolbarIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
}));

export default function MenuAdmin() {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <CssBaseline />
      <MyAppBar position="absolute" open={open}>
        {/* Aqui você pode colocar nome do usuário etc. */}
      </MyAppBar>

      <MyDrawer variant="permanent" open={open}>
        <ToolbarIcon>
          <img src={Logo} alt="Logo" style={{ marginRight: 130 }} width={40} height={40} />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            style={{ color: '#00AB55', marginRight: 6 }}
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </ToolbarIcon>
        <List>{mainListItems(open)}</List>
      </MyDrawer>
    </>
  );
}

// export default function MenuAdmin(props) {

//   const [open, setOpen] = useState(true);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <CssBaseline />
//       <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
//         {/* Nome do usuário logado que está vindo do Auth */}

//       </AppBar>
//       <Drawer
//         variant="permanent"
//         classes={{
//           paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
//         }}
//         open={open}>
//         <div className={classes.toolbarIcon}>
//           <img src={Logo} alt={"Logo"} style={{ marginRight: 130 }} width={40} height={40} />
//           <IconButton onClick={handleDrawerClose}>
//             <ChevronLeftIcon />
//           </IconButton>

//           <IconButton style={{ color: '#00AB55', marginRight: 6 }}
//             edge="start"
//             onClick={handleDrawerOpen}
//             className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
//           >
//             <MenuIcon />
//           </IconButton>
//         </div>
//         <Divider />
//         <List>{mainListItems(open)}</List>
//         {/* <Divider /> */}
//         {/* <List>{secondaryListItems}</List> */}
//       </Drawer>
//     </>
//   )
// }

// const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
//   toolbarIcon: {
//     display: 'flex',
//     backgroundColor: '#FFF',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: '0 8px',
//     ...theme.mixins.toolbar,
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//     backgroundColor: '#FFF',
//     width: '94.7%',
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   },
//   appBarShift: {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     color: "#dedede",
//   },

//   menuButtonHidden: {
//     display: 'none'
//   },

//   drawerPaper: {
//     position: 'relative',
//     whiteSpace: 'nowrap',
//     backgroundColor: "#FFF",
//     borderRightWidth: 1,
//     borderColor: '#dedede',
//     "& .MuiListItem-button": {
//       color: "#00ab55",

//     },
//     "& .MuiListItem-button:hover": {

//       backgroundColor: "#00ab5514",

//     },
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   drawerPaperClose: {
//     overflowX: 'hidden',
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     width: theme.spacing(7),
//     [theme.breakpoints.up('sm')]: {
//       width: theme.spacing(9),
//     },
//   },
//   fixedHeight: {
//     height: 240,
//   },
// }));