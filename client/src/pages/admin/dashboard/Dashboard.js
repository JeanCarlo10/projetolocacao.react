import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@mui/material/Grid';
import MenuAdmin from '../../../components/menu-admin';
import NotificacaoPedido from '../../../components/notificacao-pedido';
import FilterDashboard from '../../../components/filter-dashboard';
import CardDashboard from '../../../components/card-dashboard';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmojiFlagsOutlinedIcon from '@mui/icons-material/EmojiFlagsOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import api from '../../../services/api';

export default function Dashboard() {
  const classes = useStyles();

  const [listaPedidos, setListaPedidos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState([]);

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    async function getDadosPedido() {
      const results = await api.get(`http://localhost:5000/api/rents/status`);
      setListaPedidos(results.data);
    }

    getDadosPedido();
  }, [statuses]);

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
                text="Não devolvido"
                icon={<GppMaybeOutlinedIcon className="size-icon" />}
                color={"#FF5252"}
              />

            </Grid>
          </Grid>

          <FilterDashboard
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            onChecked={setStatuses}
            onChangeKeyword={setKeyword}
          />

          <NotificacaoPedido
            currentMonth={currentMonth}
            statuses={statuses}
            keyword={keyword}
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

  // appBarSpacer: theme.mixins.toolbar,
}));