import React, { useState, useEffect, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Button from '@material-ui/core/Button';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { getTypeUser, getTypeUserLabel } from '../../../functions/static_data';
import lottie from 'lottie-web';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function IndexUsuario() {
  const classes = useStyles();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [open, setOpen] = useState(false);
  const container = useRef(null);

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
    async function loadUsers() {
      const response = await api.get("/api/users");

      setUsers(response.data);
      setLoading(false);
    }
    setTimeout(() => loadUsers(), 2000);
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      var result = await api.delete('api/users/' + id);

      if (result.status = 200) {
        window.location.href = '/admin/usuarios';
      } else {
        alert('Ocorreu um erro. Por favor, tente novamente')
      }
    }
  }

  const handleDrawerFilter = () => {
    setOpen(true);
  };

  const [selectTypeUser, setSelectTypeUser] = useState({
    administrador: false,
    funcionario: false,
  });

  const handleChange = (event) => {
    setSelectTypeUser({ ...selectTypeUser, [event.target.name]: event.target.checked });
  };

  return (
    <div className={classes.root}>
      <MenuAdmin/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
        <Card>
          <CardHeader className={classes.cardHeader}
            title="Usuários"
            subheader={
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href={'/admin'} >
                Painel
              </Link>
              <Typography color="textPrimary">Lista de usuário</Typography>
            </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10}}>
                <Button 
                  variant="contained" 
                  size="medium"
                  color='primary' 
                  href={'/admin/usuarios/create'} 
                  startIcon={<AddCircleRoundedIcon/>}>
                    Cadastrar
                </Button>
                
                <Tooltip title="Filtros">
                  <IconButton size="large" onClick={handleDrawerFilter}>
                    <FilterListRoundedIcon />
                  </IconButton>
                  
                </Tooltip>

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
                      <div>
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                          <SearchIcon />
                        </IconButton>
                        <InputBase
                          placeholder="Buscar por nome"
                        />
                      </div>
                      <div className={classes.drawerTitle}>
                        Tipo de usuário
                      </div>
                      <Divider variant="fullWidth" />
                      <div>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={selectTypeUser.administrador} color="primary" onChange={handleChange} name="administrador" />}
                            label="Administrador"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={selectTypeUser.funcionario} color="primary" onChange={handleChange} name="funcionario" />}
                            label="Funcionário"
                          />
                        </FormGroup>
                      </div>

                      <div className={classes.drawerFooter}>
                      <Button variant="contained" color='default' startIcon={<SearchIcon />}>Buscar</Button>
                      </div>
                    </div>
                    
                  </div>
                    {/* <List>{secondaryListItems}</List> */}
                  </Drawer>
              </div>
            }
          />
          
          {loading ? (<div style={{width: 400, margin: '0 auto'}} ref={container} />) : (
          <CardContent>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
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
              {users.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString('pt-br')}</TableCell>
                  <TableCell>{row.nmUsuario}</TableCell>
                  <TableCell>{row.dsEmail}</TableCell>
                  <TableCell align="center"><Chip label={getTypeUser(row.flUsuario)} color={getTypeUserLabel(row.flUsuario)} /></TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Tooltip title="Editar">
                      <IconButton  href={'/admin/usuarios/edit/' + row._id}>
                        <EditIcon
                          className={classes.buttonTable}
                          color="primary"
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDelete(row._id)}>
                        <DeleteIcon
                          className={classes.buttonTable}
                          color="error"
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          )}
        </Card>
        </Container>     
      </main>
    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
      fontSize: 15
    }
  },
  buttonTable: {
    margin: theme.spacing(0.5)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
      "& .MuiCardHeader-title": {
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#7F8F97'
      },
  },
  appBarSpacer: theme.mixins.toolbar,
}));