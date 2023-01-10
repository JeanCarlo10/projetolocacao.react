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
import Tooltip from '@mui/material/Tooltip';
import Button from '@material-ui/core/Button';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
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
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import lottie from 'lottie-web';
import Swal from 'sweetalert2';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function IndexMaterial() {
  const classes = useStyles();
  const container = useRef(null);
  const ref = useRef(null);

  const [materials, setMaterials] = useState([]);
  const [keyword, setKeyword] = useState("");

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
      animationData: require('../../../assets/search2.json'),
    })
  }, []);

  useEffect(() => {
    async function getMaterials() {
      var filter = `keyword=${keyword}`;
      const results = await api.get(`http://localhost:5000/api/materials/index?${filter}`);

      setMaterials(results.data);
      setLoading(false);
    }
    getMaterials();
  }, [keyword]);

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Exclusão',
      text: 'Deseja realmente excluir este material?',
      showCloseButton: true,
      confirmButtonText: 'Sim, excluir!',
      confirmButtonColor: '#d33333',
      showCancelButton: true,
      cancelButtonText: 'Não',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete('api/materials/' + id)

        if (result.status = 200) {
          window.location.href = '/admin/materiais';
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
        <Container maxWidth="lg" className={classes.container}>
          <CardHeader className={classes.cardHeader}
            title="Materiais"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin/materiais'} >
                  Painel
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Lista de materiais</Typography>
              </Breadcrumbs>
            }
            action={
              <div style={{ paddingTop: 10 }}>
                <Button
                  className={classes.btnDefaultGreen}
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

          {loading ? (<div style={{ width: 450, margin: '0 auto' }} ref={container} />) : (
            <Card style={{ borderRadius: 15 }}>
              <div style={{ padding: 8 }}>
                <div className={classes.iconButton}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Buscar..."
                  />
                </div>
              </div>

              <TableContainer>
                <Table className={classes.table} size="small">
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
                            {/* <IconButton onClick={() => setIsOpenMenu(true)}>
                        <MoreVertIcon
                          className={classes.buttonTable}
                        />
                    </IconButton> */}
                            <Tooltip title="Excluir">
                              <IconButton onClick={() => handleDelete(row._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton href={'/admin/materiais/edit/' + row._id}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
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
                                <IconButton href={'/admin/materiais/edit/' + row._id}>
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
                {materials.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro encontrado</div>}
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
    },
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