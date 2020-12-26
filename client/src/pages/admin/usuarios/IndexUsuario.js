import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { getTypeUser, getTypeUserLabel } from '../../../functions/static_data';

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

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/api/users");

      setUsers(response.data);
      setLoading(false);
    }
    loadUsers();
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

  const useStylesFacebook = makeStyles((theme) => ({
    root: {
      position: 'relative',
    },
    bottom: {
      color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    top: {
      color: '#1a90ff',
      animationDuration: '550ms',
      position: 'absolute',
      left: 0,
    },
    circle: {
      strokeLinecap: 'round',
    },
  }));
  
  function FacebookCircularProgress(props) {
    const classes = useStylesFacebook();
  
    return (
      <div className={classes.root}>
        <CircularProgress
          variant="determinate"
          className={classes.bottom}
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={40}
          thickness={4}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Lista de usuários'} />


      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        
        <Container maxWidth="lg" className={classes.container}>
            
        <Paper className={classes.paper}>
        
        <Grid container style={{ justifyContent: 'space-between', marginBottom: 10, marginRight: 5  }}>
          <Button variant="contained" size="small" color='primary' href={'/admin/usuarios/create'} startIcon={<AddCircleIcon />}>Cadastrar</Button>
        
          <Tooltip title="Filtros">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Divider variant="fullWidth" />

        {loading ? (<FacebookCircularProgress style={{  margin: '20 auto'}} />) : (
        
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"></TableCell>
                      <TableCell>Data de cadastro</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((row) => (
                      <StyledTableRow key={row._id}>
                        <TableCell>
                          <Tooltip title="Visualizar">
                            <IconButton>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton href={'/admin/usuarios/edit/' + row._id}>
                              <EditIcon
                                color="primary"
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton onClick={() => handleDelete(row._id)}>
                              <DeleteIcon
                                color="error"
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                        <TableCell>{new Date(row.createdAt).toLocaleDateString('pt-br')}</TableCell>
                        <TableCell component="th" scope="row">{row.nmUsuario}</TableCell>
                        <TableCell>{row.dsEmail}</TableCell>
                        <TableCell align="center"><Chip label={getTypeUser(row.flUsuario)} color={getTypeUserLabel(row.flUsuario)} /></TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          )}         

          </Paper>
        </Container>       
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  table: {
    minWidth: 750,
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  
}));