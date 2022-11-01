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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import lottie from 'lottie-web';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Popover from '@mui/material/Popover';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function IndexCliente() {
  const classes = useStyles();
  const container = useRef(null);
  const ref = useRef(null);

  const tipoPessoaMap = { 'Fisica': 'Física', 'Juridica': 'Jurídica' };
  const [clients, setClients] = useState([]);
  const [filterClients, setFilterClients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
    async function loadClients() {

      const response = await api.get("/api/clients");

      setClients(response.data);
      setFilterClients(response.data);

      setLoading(false);
    }
    loadClients();
    //setTimeout(() => loadClients(), 2000);
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      text: `Deseja realmente excluir este cliente?`,
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#d33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete('api/clients/' + id)

        if (result.status = 200) {
          window.location.href = '/admin/clientes';
        }
      }
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Filtrar Lista
  const handleChangeSearch = ({ target }) => {
    setSearch(target.value);
    filter(target.value);
  }

  const filter = (endSearch) => {
    var resultSearch = filterClients.filter((result) => {
      if (result.nomeCliente.toString().toLowerCase().includes(endSearch.toLowerCase())
        || result.cpf.toString().toLowerCase().includes(endSearch.toLowerCase())
        || result.cnpj.toString().toLowerCase().includes(endSearch.toLowerCase())
      ) {
        return result;
      }
    });
    setClients(resultSearch);
  }

  return (
    <div className={classes.root}>
      <MenuAdmin />

      <main className={classes.content}>

        <Container maxWidth="lg" className={classes.container}>

          <CardHeader className={classes.cardHeader}
            title="Clientes"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin'} >
                  Painel
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }} >Lista de clientes</Typography>
              </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10 }}>
                <Button
                  className={classes.btnDefaultGreen}
                  variant="contained"
                  size="large"
                  color='primary'
                  href={'/admin/clientes/create'}
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
                  <IconButton >
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
                      <TableCell>Tipo pessoa</TableCell>
                      <TableCell>Nome/Nome Fantasia</TableCell>
                      <TableCell>CPF/CNPJ</TableCell>
                      <TableCell>Endereço</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {clients && clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow hover key={row._id}>
                        <TableCell align="left"><Chip style={{ fontFamily: 'Public Sans' }} label={tipoPessoaMap[(row.tipoPessoa)]} /></TableCell>
                        <TableCell>
                          {row.nomeCliente}
                          {row.contacts.map((item) => (
                            <Stack direction="row" mt={0.5}>
                              <Chip style={{ fontFamily: 'Public Sans' }} icon={item.tipoTelefone == "Celular" ? <PhoneAndroidIcon /> : <PhoneIcon />} label={item.numero} />
                            </Stack>
                          ))}
                        </TableCell>
                        <TableCell>{row.tipoPessoa == 'Fisica' ? row.cpf : row.cnpj}</TableCell>
                        <TableCell>{row.logradouro == null || undefined ? " " : row.logradouro + ", " + row.numero + " - " + row.bairro}</TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <IconButton onClick={handleClick}>
                            <MoreVertIcon />
                          </IconButton>
                          {/* <IconButton onClick={() => handleDelete(row._id)}>
                            <DeleteIcon />
                          </IconButton>
                          <IconButton href={'/admin/clientes/edit/' + row._id}>
                            <EditIcon />
                          </IconButton> */}
                        </TableCell>

                        <Popover
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                          }}
                          transformOrigin=
                          {{
                            vertical: 'top',
                            horizontal: 'right'
                          }}
                        >
                          <MenuItem onClick={() => handleDelete(row._id)}>
                            <ListItemIcon>
                              <IconButton >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText primary="Excluir" />
                          </MenuItem>

                          <MenuItem >
                            <ListItemIcon >
                              <IconButton href={'/admin/clientes/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText primary="Editar" />
                          </MenuItem>
                        </Popover>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {clients.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro encontrado</div>}
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={clients.length}
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
  // appBarSpacer: theme.mixins.toolbar,
}));