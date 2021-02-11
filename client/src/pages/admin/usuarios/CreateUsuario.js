import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputLabel, FormControl, Select } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
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

  function handleClear() {
    setNome('');
    setEmail('');
    setSenha('');
    setTipo('');
  }

  return (
    <div className={classes.root}>
      <MenuAdmin/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" className={classes.container}>
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
          <CardContent className={classes.inputs}>
            <TextField
              required
              variant="outlined"
              id="nome"
              name="nome"
              label="Nome usuário"
              autoComplete="nome"
              autoFocus
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
            <TextField
              required
              variant="outlined"
              id="email"
              name="email"
              label="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className={classes.twoInputs}>
              <TextField
                variant="outlined"
                type="password"
                required
                id="senha"
                name="senha"
                label="Senha"
                autoComplete="senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="tipo">Tipo de usuário</InputLabel>
                <Select
                    id="tipo"
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    label="Tipo de usuário"
                  >
                  <MenuItem value="" />
                  <MenuItem  value={1}>Administrador</MenuItem>
                  <MenuItem  value={2}>Funcionário</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button variant="contained" size="small" className={classes.button} color='default' href={'/admin/usuarios'} startIcon={<ArrowBackIcon />}>Voltar</Button>
            <Button variant="contained" size="small"  className={classes.button} color='primary' onClick={handleClear} startIcon={<CachedIcon />}>Limpar</Button>
            <Button variant="contained" size="small" href={'/admin/usuarios'} className={classes.btnSalvar} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
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
  container: {
    marginTop: 90
  },
  inputs: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    }
  },
  twoInputs: {
     display: 'flex',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '50%',
  },
  button: {
    margin: theme.spacing(0.5),
  },
  btnSalvar: {
    backgroundColor: "#36A420",
    color: "#FFF",
    "&:hover": {backgroundColor: "green"} //1bb934
  },
  appBarSpacer: theme.mixins.toolbar,
}));