import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {
  Grid, Checkbox, Tooltip, FormControl, OutlinedInput,
  InputLabel, MenuItem, ListItemText, Select, Box
} from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { statusFilterDashboard } from '../../../functions/static_data';
import lottie from 'lottie-web';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  MenuListProps: {
    sx: {
      "&& .Mui-selected": {
        backgroundColor: "#00AB5514",

        '&: hover': {
          backgroundColor: "#00AB5514"
        }
      },
      "&& .Mui-checked": {
        color: '#00AB55'
      }
    }
  },

  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function IndexPedido() {
  const container = useRef(null);

  const [rents, setRents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleResetFilters = () => {
    setKeyword("");
    setStatuses([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/img/lottie/search.json'),
    })
  }, []);

  useEffect(() => {
    async function fetchRents() {
      var filter = `keyword=${keyword}`;
      filter += `&statuses=${statuses.join(",")}`;
      const results = await api.get(`api/rents/index?${filter}`);

      setRents(results.data);
      setLoading(false);
    }
    fetchRents();
  }, [keyword, statuses]);

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdmin />
      <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        <Container maxWidth="xl">

          <CardHeader
            sx={{
              padding: 0,

              "& .MuiCardHeader-title": {
                fontWeight: 700,
                color: '#212B36',
                marginBottom: '8px',
              },
            }}
            title="Pedidos"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin'} >
                  Painel
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }} >Lista de pedidos</Typography>
              </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10 }}>
                <Button
                  variant="contained"
                  size="large"
                  color='primary'
                  href={'/admin/pedidos/create'}
                  startIcon={<AddCircleRoundedIcon />}>
                  Cadastrar
                </Button>
              </div>
            }
          />

          <Box sx={{
            borderRadius: '10px',
            padding: 2,
            margin: '24px 0',
            border: "1px solid #E0E1E0",
            boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 8,
              color: '#616161'
            }}>
              <FilterAltRoundedIcon />
              <span style={{ fontSize: '18px', fontWeight: 600 }}>Filtros</span>
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton>
                          <SearchRoundedIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="Buscar cliente ou Nº pedido"
                  variant="outlined"
                />
              </Grid>
              <Grid item row xs={12} sm={6} md={5} >
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={statuses}
                    onChange={(e) => setStatuses(e.target.value)}
                    input={<OutlinedInput label="Status" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {statusFilterDashboard.map((item) => (
                      <MenuItem key={item.id} value={item.label}>
                        <Checkbox success checked={statuses.indexOf(item.label) > -1} />
                        <ListItemText primary={item.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item row xs={12} sm={12} md={2}>
                <Button variant="contained" fullWidth style={{ height: '56px' }} onClick={handleResetFilters}>
                  Limpar filtros
                </Button>
              </Grid>
            </Grid>
          </Box>

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 8 }}>
              <TableContainer >
                <Table size="small"
                  sx={{
                    minWidth: 750,

                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      fontSize: 16,
                      backgroundColor: '#D2D2D2',
                      color: '#3B4251'
                    },
                  }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Nº Pedido</TableCell>
                      <TableCell align="center">Data pedido</TableCell>
                      <TableCell align="left">Nome</TableCell>
                      <TableCell align="center">Período</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rents &&
                      rents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell style={{ width: "15%" }} align="center">
                            {row.status === 'Pendente' &&
                              <Chip label={row.status} sx={{ background: '#FFC107', color: '#FFF', fontWeight: 700, minWidth: 114 }} />
                            }
                            {row.status === 'Entregue' &&
                              <Chip label={row.status} sx={{ background: '#00AB55', color: '#FFF', fontWeight: 700, minWidth: 114 }} />
                            }
                            {row.status === 'Cancelado' &&
                              <Chip label={row.status} sx={{ background: '#E71A3B', color: '#FFF', fontWeight: 700, minWidth: 114 }} />
                            }
                            {row.status === 'Devolvido' &&
                              <Chip label={row.status} sx={{ background: '#0033C6', color: '#FFF', fontWeight: 700, minWidth: 114 }} />
                            }
                            {row.status === 'Não Devolvido' &&
                              <Chip label={row.status} sx={{ background: '#FF5722', color: '#FFF', fontWeight: 700, minWidth: 114 }} />
                            }
                          </TableCell>

                          <TableCell style={{ width: "10%" }} align="center">{row.numeroPedido}</TableCell>
                          <TableCell align="center">{new Date(row.dataPedido).toLocaleDateString('pt-br')}</TableCell>
                          <TableCell style={{ width: "35%" }} align="left">
                            {row.cliente?.tipoPessoa === 'Fisica' ? row.cliente?.nomeCliente : row.cliente?.nomeFantasia}
                          </TableCell>
                          <TableCell align="center">
                            <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                              <EventAvailableRoundedIcon sx={{ color: '#00AB55', fontSize: 25 }} />
                              <span style={{ color: '#00AB55', fontWeight: 700 }}>
                                {new Date(row.dataEntrega).toLocaleDateString('pt-br')}
                              </span>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                              <EventBusyRoundedIcon sx={{ color: '#F93C65', fontSize: 25 }} />
                              <span style={{ color: '#F93C65', fontWeight: 700 }}>
                                {new Date(row.dataDevolucao).toLocaleDateString('pt-br')}
                              </span>
                            </p>
                          </TableCell>
                          <TableCell style={{ width: 'auto', whiteSpace: 'nowrap' }} align="right">
                            <Tooltip title="Visualizar">
                              <IconButton href={'/admin/pedidos/overview/' + row._id}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton href={'/admin/pedidos/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {rents.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
                  Nenhum registro encontrado.
                </div>}
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage={'Linhas por página'}
                labelDisplayedRows={
                  ({ from, to, count }) => {
                    return '' + from + '-' + to + ' de ' + count
                  }
                }
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}