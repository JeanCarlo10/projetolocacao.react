import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuAdmin from '../../../components/menu-admin';
import NotificacaoPedido from '../../../components/notificacao-pedido';
import FilterDashboard from '../../../components/filter-dashboard';
import CardDashboard from '../../../components/card-dashboard';
import IconLocacaoAtiva from '../../../assets/img/icon-locacao-ativa.svg';
import IconLocacaoPendente from '../../../assets/img/icon-locacao-pendente.png';
import IconLocacaoAtrasada from '../../../assets/img/icon-locacao-atrasada.svg';
import api from '../../../services/api';

export default function Dashboard() {
  const [listaPedidos, setListaPedidos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState([]);

  const resetFilters = () => {
    setKeyword("");
    setStatuses([]);
    setCurrentMonth(new Date());
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    async function getDadosPedido() {
      const results = await api.get(`api/rents/status`);
      setListaPedidos(results.data);
    }

    getDadosPedido();
  }, [statuses]);

  return (
    <Root>
      <MenuAdmin title={'Dashboard'} />

      <Content>
        <Container maxWidth="xl">
          <div style={{ color: '#212B36', fontSize: '24px', fontWeight: 700, marginBottom: 8 }}>
            Painel
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
                className="card__ativas card__title"
                number={listaPedidos.totalEntregues}
                text="Locações ativas"
                color={"#00ab55"}
                icon={
                  <div className='container__icon__ativas'>
                    <img src={IconLocacaoAtiva} alt={"Ícone"} className="size__icon" />
                  </div>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
                className="card__pendentes card__title"
                number={listaPedidos.totalPendentes}
                text="Locações pendentes"
                color={"#FF6700"}
                icon={
                  <div className='container__icon__pendentes'>
                    <img src={IconLocacaoPendente} alt={"Ícone"} className="size__icon" />
                  </div>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <CardDashboard
                className="card__atrasadas card__title"
                number={listaPedidos.totalNaoDevolvido}
                text="Locações atrasadas"
                color={"#FF5252"}
                icon={
                  <div className='container__icon__atrasadas'>
                    <img src={IconLocacaoAtrasada} alt={"Ícone"} className="size__icon" />
                  </div>
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <FilterDashboard
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                search={keyword}
                onChangeSearch={setKeyword}
                status={statuses}
                onChangeStatus={setStatuses}
                onResetFilters={resetFilters}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <NotificacaoPedido
                currentMonth={currentMonth}
                statuses={statuses}
                keyword={keyword}
              />
            </Grid>
          </Grid>
        </Container>
      </Content>
    </Root>
  );
}

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#F8F8F8',
  
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
}));