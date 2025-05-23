import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import IconListaContatos from '../../../assets/img/icon-contact-list.svg';
import lottie from 'lottie-web';
import { mask } from 'remask';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

export default function IndexCliente() {
  const container = useRef(null);

  const tipoPessoaMap = { 'Fisica': 'Física', 'Juridica': 'Jurídica' };
  const [clients, setClients] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getNomeExibido = (cliente) => {
    return cliente.tipoPessoa === 'Fisica' ? cliente.nomeCliente || '' : cliente.nomeFantasia || '';
  };

  const sortedClients = [...clients].sort((a, b) => {
    const valA = getNomeExibido(a).toLowerCase();
    const valB = getNomeExibido(b).toLowerCase();

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

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
    async function fetchClients() {
      var filter = `keyword=${keyword}`;
      const results = await api.get(`api/clients/index?${filter}`);

      setClients(results.data);
      setLoading(false);
    }
    fetchClients();
  }, [keyword]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverRowId, setPopoverRowId] = useState(null);

  const handlePopoverOpen = (event, rowId) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverRowId(rowId);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverRowId(null);
  };

  const isPopoverOpen = (rowId) => popoverRowId === rowId;

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
                    placeholder="Buscar nome ou cpf/cnpj"
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
                      <TableCell align="center">Tipo pessoa</TableCell>
                      <TableCell align="left" sortDirection={orderBy === 'nome' ? order : false}>
                        <TableSortLabel
                          active={orderBy === 'nome'}
                          direction={order}
                          onClick={() => handleSort('nome')}
                        >
                          Nome
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="left">CPF/CNPJ</TableCell>
                      <TableCell align="left">Endereço</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sortedClients &&
                      sortedClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow hover key={row._id}>
                          <TableCell align="center">
                            <Chip style={{
                              fontFamily: 'Nunito',
                              fontSize: 14,
                              fontWeight: 700,
                              minWidth: 100,
                              backgroundColor: row.tipoPessoa === 'Fisica' ? '#D7F0FF' : '#FFDB9B',
                              color: row.tipoPessoa === 'Fisica' ? '#2463EB' : '#D28D0F',
                            }}
                              label={tipoPessoaMap[(row.tipoPessoa)]}
                            />
                          </TableCell>

                          <TableCell >
                            <IconButton onClick={(e) => handlePopoverOpen(e, row._id)} style={{ marginRight: '4px' }}>
                              <img src={IconListaContatos} alt={"Lista"} height={35} />
                            </IconButton>

                            <Popover
                              id={`contact-popover-${row._id}`}
                              open={isPopoverOpen(row._id)}
                              anchorEl={popoverAnchor}
                              onClose={handlePopoverClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
                                {row.contacts.length > 0 &&
                                  <Typography style={{ fontSize: '16px', fontWeight: 700, textAlign: 'center' }}>
                                    Contatos
                                  </Typography>
                                }

                                {row.contacts.length > 0 ?
                                  (row.contacts.map((item, index) => (
                                    <Chip
                                      key={index}
                                      icon={item.tipoTelefone === "Celular" ? <PhoneAndroidIcon /> : <PhoneIcon />}
                                      label={item.numero}
                                      style={{ fontFamily: 'Nunito' }}
                                    />

                                  ))
                                  ) : (
                                    <Typography style={{ fontSize: '16px', fontWeight: 700, textAlign: 'center' }}>
                                      Sem contatos
                                    </Typography>
                                  )}
                              </div>
                            </Popover>

                            {row.tipoPessoa === 'Fisica' ? row.nomeCliente : row.nomeFantasia}
                          </TableCell>

                          <TableCell align="left">
                            {row.tipoPessoa === 'Fisica' ? mask(row.cpf ?? '', ['999.999.999-99']) : mask(row.cnpj ?? '', ['99.999.999/9999-99'])}
                          </TableCell>
                          <TableCell>
                            {row.logradouro == null || undefined ? " " : row.logradouro + ", " + row.numero + " - " + row.bairro}
                          </TableCell>
                          <TableCell style={{ width: 'auto', whiteSpace: 'nowrap' }} align="right">
                            <Tooltip title="Visualizar">
                              <IconButton href={'/admin/clientes/overview/' + row._id}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton href={'/admin/clientes/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {clients.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
                  Nenhum registro encontrado.
                </div>}
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