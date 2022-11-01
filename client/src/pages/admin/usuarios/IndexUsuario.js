import React, { useState, useEffect, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TablePagination from '@mui/material/TablePagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

import lottie from 'lottie-web';
import api from '../../../services/api';
import MenuAdmin from '../../../components/menu-admin';
import { getTypeUser, getTypeUserLabel } from '../../../functions/static_data';
import Swal from 'sweetalert2';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function IndexUsuario() {
  const classes = useStyles();
  const container = useRef(null);
  const ref = useRef(null);

  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
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

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/api/users");

      setUsers(response.data);
      setFilterUsers(response.data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      text: 'Deseja realmente excluir este usuário?',
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#d33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete('api/users/' + id)

        if (result.status = 200) {
          window.location.href = '/admin/usuarios';
        }
      }
    })
  }

  const [selectTypeUser, setSelectTypeUser] = useState({
    administrador: false,
    funcionario: false,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (event) => {
    setSelectTypeUser({ ...selectTypeUser, [event.target.name]: event.target.checked });
  };

  //Filtrar Lista
  const handleChangeSearch = ({ target }) => {
    setSearch(target.value);
    filter(target.value);
  }

  const filter = (endSearch) => {
    var resultSearch = filterUsers.filter((result) => {
      if (result.nmUsuario.toString().toLowerCase().includes(endSearch.toLowerCase())
      ) {
        return result;
      }
    });
    setUsers(resultSearch);
  }

  return (
    <div className={classes.root}>
      <MenuAdmin />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
          <CardHeader className={classes.cardHeader}
            title="Usuários"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin'} >
                  Painel
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Lista de usuários</Typography>
              </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10 }}>
                <Button
                  className={classes.btnDefaultGreen}
                  variant="contained"
                  size="large"
                  href={'/admin/usuarios/create'}
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

              <TableContainer>
                <Table className={classes.table} size="small" >
                  <TableHead>
                    <TableRow>
                      <TableCell>Data de cadastro</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow hover key={row._id}>
                        <TableCell>{new Date(row.createdAt).toLocaleDateString('pt-br')}</TableCell>
                        <TableCell>{row.nmUsuario}</TableCell>
                        <TableCell>{row.dsEmail}</TableCell>
                        <TableCell align="center"><Chip label={getTypeUser(row.flUsuario)} color={getTypeUserLabel(row.flUsuario)} /></TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <IconButton onClick={() => setIsOpenMenu(true)}>
                            <MoreVertIcon
                              className={classes.buttonTable}
                            />
                          </IconButton>
                        </TableCell>

                        <Menu
                          open={isOpenMenu}
                          anchorEl={ref.current}
                          onClose={() => setIsOpenMenu(false)}
                          PaperProps={{
                            sx: { width: 200, maxWidth: '100%' }
                          }}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <MenuItem>
                            <ListItemIcon>
                              <IconButton onClick={() => handleDelete(row._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText primary="Excluir" />
                          </MenuItem>

                          <MenuItem >
                            <ListItemIcon >
                              <IconButton href={'/admin/usuarios/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText primary="Editar" />
                          </MenuItem>
                        </Menu>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
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
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  avatarFilter: {
    color: '#4DB4C6',
    backgroundColor: '#E7F7F9',
    marginRight: theme.spacing(2),
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
    },
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

  appBarSpacer: theme.mixins.toolbar,
}));