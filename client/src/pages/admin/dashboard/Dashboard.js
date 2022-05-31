import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MenuAdmin from '../../../components/menu-admin';
import CardLocacoesAtivas from '../../../components/card-locacoes-ativas';
import CardAcoesPendentes from '../../../components/card-acoes-pendentes';
import CardRetiradas from '../../../components/card-retiradas';
import { IconButton } from '@mui/material';
import api from '../../../services/api';
import NotificacaoPedido from '../../../components/notificacao-pedido';
import { getCurrentMonth } from '../../../helpers/dateFilter';
import FilterDashboard from '../../../components/filter-dashboard';
import FilterStatus from '../../../components/filter-status';

export default function Dashboard() {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [listaPedidos, setListaPedidos] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  const [status, setStatus] = useState([
    {
      id: 1,
      checked: false,
      label: 'Pendente'
    },
    {
      id: 2,
      checked: false,
      label: 'Entregue'
    },
    {
      id: 3,
      checked: false,
      label: 'Cancelado'
    },
    {
      id: 4,
      checked: false,
      label: 'Devolvido'
    },
  ]);

  useEffect(() => {

  }, [listaPedidos, currentMonth]);

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangeChecked = (id) => {
    const statusList = status;
    const changeCheckedStatus = statusList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setStatus(changeCheckedStatus);
    console.log(setStatus);
  };

  const applyFilters = () => {
    let updatedList = listaPedidos;

    //Filter Status
    const statusChecked = status.filter(item => item.checked).map((item) => item.label.toLowerCase());

    if (statusChecked.length) {
      updatedList = updatedList.filter(item =>
        statusChecked.includes(item.status)
      );
    };

    setListaPedidos(updatedList);
  }

  useEffect(() => {
    applyFilters();
  }, [status]);

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Dashboard'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>

          <Grid container spacing={3} marginBottom={4}>
            <Grid item xs={12} sm={6} md={4}>
              <CardLocacoesAtivas />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardAcoesPendentes />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardRetiradas />
            </Grid>
          </Grid>

          <FilterDashboard
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
          
          <NotificacaoPedido
            
          />
        </Container>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#F8F8F8'
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    // padding: theme.spacing(2),
  },

  appBarSpacer: theme.mixins.toolbar,
}));