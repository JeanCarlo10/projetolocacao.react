import React, { useState, useEffect, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
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
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

import lottie from 'lottie-web';
import { getTypeClient } from '../../../functions/static_data';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

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

  const [clients, setClients] = useState([]);
  const [filterClients, setFilterClients] = useState([]);
  const [search, setSearch] = useState ("");

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../../assets/search.json'),
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
    // setTimeout(() => loadClients(), 2000);
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      var result = await api.delete('api/clients/' + id);

      if (result.status = 200) {
        window.location.href = '/admin/clientes';
      } else {
        alert('Ocorreu um erro. Por favor, tente novamente')
      }
    }
  }

  const handleDrawerFilter = () => {
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  //Filtrar Lista
  const handleChangeSearch = ({target}) => {
    setSearch(target.value);
    filter(target.value);
  }

  const filter = (endSearch) => {
    var resultSearch = filterClients.filter((result) => {
      if (result.nmCliente.toString().toLowerCase().includes(endSearch.toLowerCase())
      || result.nmRazaoSocial.toString().toLowerCase().includes(endSearch.toLowerCase())
      || result.nrCPF.toString().toLowerCase().includes(endSearch.toLowerCase())
      || result.nrCNPJ.toString().toLowerCase().includes(endSearch.toLowerCase())
      ){
        return result;
      }
    });
    setClients(resultSearch);
  }

  return (
    <div className={classes.root}>
      <MenuAdmin/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

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
              <div style={{ paddingTop: 10}}>
                <Button 
                  className={classes.btnDefaultGreen}
                  variant="contained" 
                  size="medium"
                  color='primary' 
                  href={'/admin/clientes/create'} 
                  startIcon={<AddCircleRoundedIcon/>}>
                    Cadastrar
                </Button>
                
                <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
                  <div style={{ width: "350px"}}>
                    <div className={classes.drawerFilter}>
                      <Avatar className={classes.avatarFilter}>
                        <FilterListRoundedIcon />
                      </Avatar>
                      <h3  style={{ color: '#5C5C62', fontSize: 20}}>Filtros</h3>
                    </div>

                    <div className={classes.drawerContent}>
                      <div className={classes.drawerTitle}>
                        Buscar por nome
                      </div>
                      <Divider variant="fullWidth" />
                      <div style={{ borderRadius: 10, borderColor: 'red', borderStyle: 'solid'}}>
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                          <SearchIcon />
                        </IconButton>
                        <InputBase
                          placeholder="Buscar por nome"
                        />
                      </div>
                      <div className={classes.drawerFooter}>
                      <Button variant="contained" color='default' startIcon={<SearchIcon />}>Buscar</Button>
                      </div>
                    </div>
                  </div>
                  </Drawer>
                </div>
            }
          />
          
          {loading ? (<div style={{width: 300, margin: '0 auto'}} ref={container} />) : (
          <Card style= {{ borderRadius: 15 }}>
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
                <Tooltip title="Filtros">
                  <IconButton size="large" onClick={handleDrawerFilter}>
                    <FilterListRoundedIcon />
                  </IconButton>
                </Tooltip>
            </div>

          <TableContainer >
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nome/Razão social</TableCell>
                  <TableCell>CPF/CNPJ</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover key={row._id}>
                      <TableCell align="left"><Chip label={getTypeClient(row.flTipo)}/></TableCell>
                      <TableCell> {row.flTipo == 1 ? row.nmCliente : row.nmRazaoSocial}</TableCell> 
                      <TableCell>{row.flTipo == 1 ? row.nrCPF : row.nrCNPJ}</TableCell>
                      <TableCell>{row.logradouro == null || undefined ?  " " : row.logradouro + ", " + row.numero + " - " + row.bairro}</TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {/* <IconButton onClick={() => setIsOpenMenu(true) }>
                            <MoreVertIcon 
                              className={classes.buttonTable}
                            />
                        </IconButton> */}
                        <IconButton onClick={() => handleDelete(row._id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton href={'/admin/clientes/edit/' + row._id}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>

                      {/* <Menu
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
                                  <IconButton href={'/admin/clientes/edit/' + row._id}>
                                    <EditIcon />
                                  </IconButton>
                              </ListItemIcon>
                              <ListItemText primary="Editar" />
                            </MenuItem>
                          </Menu> */}
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
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
    borderRadius: 50, 
    borderColor: '#F4F4F4',
    borderStyle: 'solid'
  },
  drawerFilter: {
    display: 'flex', 
    padding: '15px', 
    alignItems: 'center',
  }, 
  avatarFilter: {
    color: '#4DB4C6',
    backgroundColor: '#E7F7F9',
    marginRight: theme.spacing(2),
  }, 
  drawerContent: {
    display: 'flex', 
    flexDirection: 'column',
    padding: '15px',    
  }, 
  drawerTitle: {
    color: '#5C5C62',
    fontSize: 18
  },
  drawerFooter: {
    display: 'flex',
    flexDirection: 'column',
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