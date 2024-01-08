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
import Button from '@material-ui/core/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@material-ui/core/Card';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

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

export default function IndexCliente() {
  const classes = useStyles();
  const container = useRef(null);

  const tipoPessoaMap = { 'Fisica': 'Física', 'Juridica': 'Jurídica' };
  const [clients, setClients] = useState([]);
  const [keyword, setKeyword] = useState("");

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
      var filter = `keyword=${keyword}`;
      const results = await api.get(`api/clients/index?${filter}`);

      setClients(results.data);
      setLoading(false);
    }
    loadClients();
    //setTimeout(() => loadClients(), 2000);
  }, [keyword]);

  const handleDelete = (id, nomeCliente) => {

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

  return (
    <div className={classes.root}>
      <MenuAdmin />

      <main className={classes.content}>

        <Container maxWidth="xl" className={classes.container}>

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
                    placeholder="Buscar cliente"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 8 }}>
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
                          {/* <IconButton onClick={handleClick}>
                            <MoreVertIcon />
                          </IconButton> */}
                          <Tooltip title="Excluir">
                            <IconButton onClick={() => handleDelete(row._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton href={'/admin/clientes/edit/' + row._id}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                        {/* <Popover
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
                        </Popover> */}
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
}));