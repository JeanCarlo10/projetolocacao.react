import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { Paper, Grid, TextField, InputLabel, FormControl, Select } from '@material-ui/core';
import PageHeader from '../../../components/page-header';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';

export default function CreateUsuario() {
  const classes = useStyles();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');

  async function handleSubmit() {
    const data = {
      nmUsuario: nome,
      dsEmail: email,
      flUsuario: tipo,
      senha: senha
    }
    if (nome != '' && email != '' && tipo != '' && senha != '') {
      const response = await api.post('/api/users', data);

      if (response.status == 200) {
        window.location.href = '/admin/usuarios'
      } else {
        alert('Erro ao cadastrar o usuário');
      }
    } else {
      alert('Campos obrigatórios');
    }
  }

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Cadastrar usuário'}/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" style={{ marginTop: 90 }}>
        {/* <PageHeader 
          title="Cadastrar usuário"
          subTitle={
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/usuarios'} >
                Usuários
              </Link>
              <Typography color="textPrimary">Cadastrar usuário</Typography>
            </Breadcrumbs>
          }
        /> */}

        {/* <Divider variant="fullWidth" /> */}

        <Card>
          <CardHeader
            title="Cadastrar usuários"
            subheader={
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/usuarios'} >
                Usuários
              </Link>
              <Typography color="textPrimary">Cadastrar usuário</Typography>
            </Breadcrumbs>
            }
            titleTypographyProps={{ align: 'left' }}
            subheaderTypographyProps={{ align: 'left' }}
            className={classes.cardHeader}
          />
          <CardContent>
            <Grid item xs={12}>
              <TextField
                required
                variant="outlined"
                margin="normal"
                fullWidth
                id="nome"
                name="nome"
                label="Nome usuário"
                autoComplete="nome"
                autoFocus
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                variant="outlined"
                margin="normal"
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>

            <Grid container direction="row" spacing={1}>
              <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    type="password"
                    required
                    id="senha"
                    name="senha"
                    label="Senha"
                    fullWidth
                    autoComplete="senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                  />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="tipo">Tipo de usuário</InputLabel>
                  <Select
                    id="tipo"
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    label="Tipo de usuário"
                    // inputProps={{
                    //   name: "tipo",
                    //   id: "tipo"
                    // }}
                  >
                  <MenuItem value="" />
                  <MenuItem  value={1}>Administrador</MenuItem >
                  <MenuItem  value={2}>Funcionário</MenuItem >
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button variant="contained" size="small" className={classes.button} color='default' href={'/admin/usuarios'} startIcon={<AddCircleIcon />}>Voltar</Button>
            <Button variant="contained" size="small" className={classes.button} color='primary' href={'/admin/usuarios/create'} startIcon={<AddCircleIcon />}>Limpar</Button>
            <Button variant="contained" size="small" href={'/admin/usuarios/create'} className={classes.btnSalvar} onClick={handleSubmit} startIcon={<AddCircleIcon />}>Salvar</Button>
          </CardActions>
        </Card>
              
        
      </Container>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing(10),
    //paddingBottom: theme.spacing(4),
  },
  btnSalvar: {
    backgroundColor: "green",
    color: "#FFF",
    "&:hover": {backgroundColor: "#12b912"}
  },
  button: {
    margin: theme.spacing(0.5),
  },
  appBarSpacer: theme.mixins.toolbar,
}));