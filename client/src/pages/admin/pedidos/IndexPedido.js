import React, { useState, useEffect, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';

import lottie from 'lottie-web';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function IndexPedido() {
  const classes = useStyles();
  const container = useRef(null);
  const ref = useRef(null);

  const [rents, setRents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  //   const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/search2.json'),
    })
  }, []);

  //   useEffect(() => {
  //     async function getDadosPedido() {
  //         var filter = `&keyword=${keyword}`;
  //         filter += `&statuses=${statuses.join(",")}`;
  //         const results = await api.get(`api/rents/search?${filter}`);
  //         setRents(results.data);
  //     }

  //     getDadosPedido();
  // }, [currentMonth, statuses, keyword]);

  useEffect(() => {
    async function loadRents() {
      var filter = `keyword=${keyword}`;
      const results = await api.get(`api/rents/index?${filter}`);

      setRents(results.data);
      console.log(results.data);
      setLoading(false);
    }
    loadRents();
    // setTimeout(() => loadRents(), 2000);
  }, [keyword]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <MenuAdmin />
      <main className={classes.content}>
        <Container maxWidth="xl" className={classes.container}>

          <CardHeader className={classes.cardHeader}
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
                  className={classes.btnDefaultGreen}
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

          <Box sx={{ mt: 2, mb: 2 }}>
            <Card>
              <CardContent>
                <Box sx={{ maxWidth: 500 }}>
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
                    placeholder="Buscar"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 15 }}>
              <TableContainer >
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ width: "15%" }}>Status</TableCell>
                      <TableCell align="center">Nº Pedido</TableCell>
                      <TableCell align="center">Data Pedido</TableCell>
                      <TableCell align="left" style={{ width: "35%" }}>Cliente</TableCell>
                      <TableCell align="center">Período</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rents &&
                      rents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell align="left">
                            {row.status == 'Pendente' &&
                              <Chip label={row.status} className={classes.chipPendente} />
                            }
                            {row.status == 'Entregue' &&
                              <Chip label={row.status} className={classes.chipEntregue} />
                            }
                            {row.status == 'Cancelado' &&
                              <Chip label={row.status} className={classes.chipCancelado} />
                            }
                            {row.status == 'Devolvido' &&
                              <Chip label={row.status} className={classes.chipDevolvido} />
                            }
                            {row.status == 'Não Devolvido' &&
                              <Chip label={row.status} className={classes.chipNaoDevolvido} />
                            }
                          </TableCell>

                          <TableCell align="center">{row.numeroPedido}</TableCell>
                          <TableCell align="center">{new Date(row.dataPedido).toLocaleDateString('pt-br')}</TableCell>
                          <TableCell align="left">{row.nomeCliente}</TableCell>
                          <TableCell align="center">
                            <p className={classes.textPeriodo}>
                              <EventAvailableRoundedIcon />
                              <div style={{ marginLeft: 5 }}>
                                {new Date(row.dataEntrega).toLocaleDateString('pt-br')}
                              </div>
                            </p>
                            <p className={classes.textPeriodo}>
                              <EventBusyRoundedIcon />
                              <div style={{ marginLeft: 5 }}>
                                {new Date(row.dataDevolucao).toLocaleDateString('pt-br')}
                              </div>
                            </p>
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
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
                {rents.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro encontrado</div>}
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',

    '& label.Mui-focused': {
      color: '#00AB55',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      fontWeight: 500,
      fontFamily: 'Public Sans',

      '& fieldset': {
        borderColor: '#dce0e4',
      },
      '&:hover fieldset': {
        borderColor: '#3d3d3d',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00AB55',
      },
    },

    '& .MuiPaper-elevation1': {
      borderRadius: '8px',
      boxShadow: 'rgb(100 116 139 / 6%) 0px 1px 1px, rgb(100 116 139 / 10%) 0px 1px 2px'
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  textPeriodo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  table: {
    minWidth: 750,
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      fontSize: 16,
      padding: 16,
      backgroundColor: '#F3F4F6',
      color: '#374151'
    }
  },
  noRegisters: {
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 700,
    fontSize: 16,
    color: '#595A4A'
  },
  btnDefaultGreen: {
    background: '#00AB55',
    color: '#FFF',
    borderRadius: '5px',
    border: 'none',
    textTransform: 'none',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#007B55',
      color: '#FFF',
    },
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontWeight: 700,
      color: '#212B36',
      marginBottom: theme.spacing(1),
    },
  },
  chipPendente: {
    background: '#FF6700',
    color: '#FFF',
    fontWeight: 500
  },
  chipEntregue: {
    background: '#00AB55',
    color: '#FFF',
    fontWeight: 500
  },
  chipCancelado: {
    background: '#ABABAB',
    color: '#FFF',
    fontWeight: 500
  },
  chipDevolvido: {
    background: '#0033C6',
    color: '#FFF',
    fontWeight: 500,
  },
  chipNaoDevolvido: {
    background: '#E71A3B',
    color: '#FFF',
    fontWeight: 500,
  }
}));