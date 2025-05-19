import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import lottie from 'lottie-web';

export default function IndexMaterial() {
  const container = useRef(null);

  const [materials, setMaterials] = useState([]);
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
    async function fetchMaterials() {
      var filter = `keyword=${keyword}`;
      const results = await api.get(`api/materials/index?${filter}`);

      setMaterials(results.data);
      setLoading(false);
    }
    fetchMaterials();
  }, [keyword]);

  const handleDelete = (material) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      html: `Deseja realmente excluir o material <strong>${material.nomeMaterial}<strong>?`,
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#D33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`api/materials/${material._id}`);

          if (response.status === 200) {
            Swal.fire('Excluído!', 'Material removido com sucesso.', 'success');
            setMaterials((prev) => prev.filter((m) => m._id !== material._id));
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
            title="Materiais"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin'} >
                  Painel
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Lista de materiais</Typography>
              </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10 }}>
                <Button
                  variant="contained"
                  size="large"
                  color='primary'
                  href={'/admin/materiais/create'}
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
              <Grid item row xs={12} sm={9} md={10}>
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
                    placeholder="Buscar material"
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid item row xs={12} sm={3} md={2}>
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
                      <TableCell>Nome</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {materials &&
                      materials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell>{row.nomeMaterial}</TableCell>
                          <TableCell component="th" scope="row" align="right">
                            <Tooltip title="Excluir">
                              <IconButton onClick={() => handleDelete(row)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton href={'/admin/materiais/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {materials.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
                  Nenhum registro encontrado.
                </div>}
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={materials.length}
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