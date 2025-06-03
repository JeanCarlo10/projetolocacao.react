import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, Tooltip, Chip, IconButton, Button, Card, Breadcrumbs, Typography, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import lottie from 'lottie-web';
import api from '../../../services/api';
import MenuAdmin from '../../../components/menu-admin';
import Swal from 'sweetalert2';

export default function IndexUsuario() {
  const container = useRef(null);

  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
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
    async function fetchUsers() {
      var filter = `keyword=${keyword}`;
      const results = await api.get(`/api/users/index?${filter}`);

      setUsers(results.data);
      setLoading(false);
    }
    fetchUsers();
  }, [keyword]);

  const handleDelete = (user) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      html: `Deseja realmente excluir o usuário <strong>${user.nomeUsuario}<strong>?`,
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#D33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`api/users/${user._id}`);

          if (response.status === 200) {
            Swal.fire('Excluído!', 'Usuário removido com sucesso.', 'success');
            setUsers((prev) => prev.filter((u) => u._id !== user._id));
          }
        } catch (error) {
          Swal.fire('Erro!', 'Não foi possível excluir o material.', 'error');
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

  // const [selectTypeUser, setSelectTypeUser] = useState({
  //   administrador: false,
  //   funcionario: false,
  // });

  // const handleChange = (event) => {
  //   setSelectTypeUser({ ...selectTypeUser, [event.target.name]: event.target.checked });
  // };

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

          <Box sx={{
            borderRadius: '10px',
            padding: 2,
            margin: '24px 0',
            border: "1px solid #E0E1E0",
            boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#616161' }}>
              <FilterAltRoundedIcon />
              <span style={{ fontSize: '18px', fontWeight: 600 }}>Filtros</span>
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={9} md={10}>
                <Box>
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
                    placeholder="Buscar nome"
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={3} md={2}>
                <Button variant="contained" fullWidth style={{ height: '56px' }} onClick={() => setKeyword("")}>
                  Limpar filtros
                </Button>
              </Grid>
            </Grid>
          </Box>

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 8 }}>
              <TableContainer>
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
                      <TableCell>Data de cadastro</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="center">Tipo de usuário</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users &&
                      users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell>{new Date(row.createdAt).toLocaleDateString('pt-br')}</TableCell>
                          <TableCell>{row.nomeUsuario}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell align="center">
                            <Chip style={{
                              fontSize: 14,
                              fontWeight: 700,
                              minWidth: 100,
                              backgroundColor: row.tipoUsuario === 'Administrador' ? '#D32F2F' : '#7E57C2',
                              color: '#FFF',
                            }}
                              label={row.tipoUsuario}
                            />

                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <Tooltip title="Excluir">
                              <IconButton onClick={() => handleDelete(row)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton href={'/admin/usuarios/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {users.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
                  Nenhum registro encontrado.
                </div>}
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
    </div >
  );
}