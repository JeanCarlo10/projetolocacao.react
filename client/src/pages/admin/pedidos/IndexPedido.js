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
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import { IconButton } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';

import lottie from 'lottie-web';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import Swal from 'sweetalert2';

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
  const [filterRents, setFilterRents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  //   const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/search2.json'),
    })
  }, []);

  useEffect(() => {
    async function loadRents() {
      const response = await api.get("/api/rents");

      setRents(response.data);
      setFilterRents(response.data);
      setLoading(false);
    }
    loadRents();
    // setTimeout(() => loadRents(), 2000);
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      text: 'Deseja realmente excluir este pedido?',
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#d33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete('api/rents/' + id)

        if (result.status = 200) {
          window.location.href = '/admin/pedidos';
        }
      }
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //Filtrar Lista
  const handleChangeSearch = ({ target }) => {
    setSearch(target.value);
    filter(target.value);
  }

  const filter = (endSearch) => {
    var resultSearch = filterRents.filter((result) => {
      if (result.nomeCliente.toString().toLowerCase().includes(endSearch.toLowerCase())
        || result.cpf.toString().toLowerCase().includes(endSearch.toLowerCase())
        || result.cnpj.toString().toLowerCase().includes(endSearch.toLowerCase())
      ) {
        return result;
      }
    });
    setRents(resultSearch);
  }
  return (
    <div className={classes.root}>
      <MenuAdmin />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>

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

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 15 }}>
              <div className={classes.twoElements}>
                <div className={classes.iconButton}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    value={search}
                    onChange={handleChangeSearch}
                    placeholder="Buscar..."
                  />
                </div>
              </div>

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
                          <TableCell align="left" style={{ width: "15%" }}>
                            <Chip label={row.status} />                         
                          </TableCell> 

                          <TableCell align="center" style={{ width: "10%" }}>{row.numeroPedido}</TableCell>
                          <TableCell align="center">{new Date(row.dataPedido).toLocaleDateString('pt-br')}</TableCell>
                          <TableCell align="left" style={{ width: "35%" }}>{row.nomeCliente}</TableCell>
                          <TableCell align="center" style={{ width: "10%" }}>
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
                            <IconButton onClick={() => handleDelete(row._id)}>
                              <DeleteIcon />
                            </IconButton>
                            <IconButton href={'/admin/pedidos/edit/' + row._id}>
                              <EditIcon />
                            </IconButton>
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
  },
  iconButton: {
    borderRadius: 10,
    borderColor: '#BCBCBC',
    borderStyle: 'solid',
    borderWidth: 2
  },
  chipOne: {
    color: '#4DB4C6',
    background: '#E7F7F9',
  },

  chipTwo: {
    color: 'orange',
    background: 'black',
  },

  avatarFilter: {
    color: '#4DB4C6',
    backgroundColor: '#E7F7F9',
    marginRight: theme.spacing(2),
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
      fontSize: 14
    }
  },
  noRegisters: {
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 700,
    fontSize: 16,
    color: '#595A4A'
  },
  buttonTable: {
    // margin: theme.spacing(0.5)
  },
  btnDefaultGreen: {
    background: '#00AB55',
    color: '#FFF',
    borderRadius: 10,
    border: 'none',
    textTransform: 'none',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: '#007B55',
      color: '#FFF',
    },
  },
  twoElements: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(1),

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontWeight: 700,
      color: '#212B36',
      marginBottom: theme.spacing(1),
    },
  },
}));