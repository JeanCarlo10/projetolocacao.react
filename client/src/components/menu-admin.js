import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Stack from '@mui/material/Stack';
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import TextField from '@mui/material/TextField';

import { mainListItems, secondaryListItems } from './list-menu-admin';
import { getNameUser } from '../services/auth';

export default function MenuAdmin(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const { title } = props;
  const [value, setValue] = useState(new Date(Date.now()));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
      
        <Toolbar className={classes.toolbar}>
          <IconButton style={{ color: '#00AB55'}}
            edge="start"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Buscar…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}

          {/* Nome do usuário logado que está vindo do Auth */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar aria-label="Avatar" src={require('../assets/avatar_10.jpg')} />
              <div style={{ color: '#00AB55', fontWeight: 'bold', marginLeft: 5 }}> 
                {getNameUser()}
              </div>
          </div>
          
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}>
        <div className={classes.toolbarIcon}>
          <img src={require('../assets/logo.svg')} style={{marginRight: 130 }} width={40} height={40}/>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />

        <List>{mainListItems}</List>

        <Divider />

        <List>{secondaryListItems}</List>
      </Drawer>
    </>
  )
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    backgroundColor: '#FFF',    
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFF',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "#dedede",
  },
  
  menuButtonHidden: {
    display: 'none'
  },
  
  title: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dedede',
    backgroundColor: "#bcbcbc",
    '&:hover': {
      backgroundColor: '#bcbcbc'[500],
    },
    marginRight: theme.spacing(3),
    marginLeft: 0,
    // width: '100%',
    marginLeft: theme.spacing(3),
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
      '&:focus': {
        width: '38ch',
      },
    },
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    backgroundColor: "#FFF",
    borderRightWidth: 1,
    borderColor: '#dedede',
    "& .MuiListItem-button": {
      color: "#00ab55",
      
    },
    "& .MuiListItem-button:hover": {
      
      backgroundColor: "#00ab5514",
      
    },
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  fixedHeight: {
    height: 240,
  },
}));