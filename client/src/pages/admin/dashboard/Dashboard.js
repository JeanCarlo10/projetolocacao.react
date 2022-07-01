import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@mui/material/Grid';
import MenuAdmin from '../../../components/menu-admin';
import CardLocacoesAtivas from '../../../components/card-locacoes-ativas';
import CardAcoesPendentes from '../../../components/card-acoes-pendentes';
import CardRetiradas from '../../../components/card-retiradas';
import NotificacaoPedido from '../../../components/notificacao-pedido';
import FilterDashboard from '../../../components/filter-dashboard';
import FilterStatus from '../../../components/filter-status';
import CardDashboard from '../../../components/card-dashboard';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmojiFlagsOutlinedIcon from '@mui/icons-material/EmojiFlagsOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import api from '../../../services/api';

export default function Dashboard() {
  const classes = useStyles();

  const [listaPedidos, setListaPedidos] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  const handleChangeChecked = (id) => {
    const statusList = status;
    const changeCheckedStatus = statusList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setStatus(changeCheckedStatus);
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

  useEffect(() => {
    async function getDadosPedido() {
      const results = await api.get(`http://localhost:5000/api/rents/status`);
      setListaPedidos(results.data);
    }

    getDadosPedido();
  }, []);

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Dashboard'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>

          <Grid container spacing={3} marginBottom={4}>
            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
                className="locacao-ativas"
                number={listaPedidos.totalEntregues}
                text="Locações ativas"
                icon={<EmojiFlagsOutlinedIcon className="size-icon" />}
                color={"#00ab55"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
                className="locacoes-pendentes"
                number={listaPedidos.totalPendentes}
                text="Locações pendentes"
                icon={<NotificationsNoneOutlinedIcon className="size-icon" />}
                color={"#FF6700"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
              className="locacoes-nao-devolvidas"
                number={listaPedidos.totalNaoDevolvido}
                text="Locações não retiradas"
                icon={<GppMaybeOutlinedIcon className="size-icon" />}
                color={"#FF5252"}
              />

            </Grid>
          </Grid>

          <FilterDashboard
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />

          <NotificacaoPedido currentMonth={currentMonth} />
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