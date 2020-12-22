import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import MenuAdmin from '../../../components/menu-admin';
import NotificationCard from '../../../components/notification-card';

export default function Dashboard() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <MenuAdmin title={'Dashboard'}/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            <div>
              <NotificationCard />
              {/* <img src={require('../../../assets/construcao.png')} /> */}
            </div>
        </Container>
      </main>
    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#F8F8F8'
  },
  
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));