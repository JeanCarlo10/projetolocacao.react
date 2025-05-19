import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import lottie from 'lottie-web';
import api from '../../../services/api';
import MenuAdmin from '../../../components/menu-admin';
import { getTypeUser, getTypeUserLabel } from '../../../functions/static_data';
import Swal from 'sweetalert2';

export default function IndexUsuario() {
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
      animationData: require('../../../assets/img/lottie/search.json'),
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
    <div style={{ display: 'flex' }}>
      <MenuAdmin />

      <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        <Container maxWidth="lg">
          <CardHeader sx={{
            "& .MuiCardHeader-title": {
              fontWeight: 700,
              color: '#212B36',
              marginBottom: '8px'
            },
          }}
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
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    value={search}
                    onChange={handleChangeSearch}
                    placeholder="Buscar..."
                  />

              <TableContainer>
                <Table size="small" >
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
                              sx={{
                                borderRadius: 10,
                                borderColor: '#BCBCBC',
                                borderStyle: 'solid',
                                borderWidth: 2
                              }}
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