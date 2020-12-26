import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { Paper, Typography, Grid, TextField, MenuItem, InputLabel, FormControl, Select } from '@material-ui/core';
import PageHeader from '../../../components/page-header';
import { AddCircle } from '@material-ui/icons';

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
        {/* <PageHeader 
          title="Usuário"
          subTitle="Bradcump"
          icon={<AddCircle />}
        /> */}
        <Paper className={classes.pageContent}>
          <form className={classes.form}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} >
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

              <Grid item xs={12} sm={12}>
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

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" >
                  <InputLabel htmlFor="tipo">Tipo de usuário</InputLabel>
                  <Select
                    native
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    label="Tipo de usuário"
                    inputProps={{
                      name: "age",
                      id: "tipo"
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value={1}>Administrador</option>
                    <option value={2}>Funcionário</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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

            </Grid>
          </form>
          <Divider variant="fullWidth" />
          <Grid container className={classes.button} style={{ paddingTop: 2}}>
            <Button variant="contained" size="small" color='default' href={'/admin/usuarios'} startIcon={<AddCircleIcon />}>Voltar</Button>
            <Button variant="contained" size="small" color='primary' href={'/admin/usuarios/create'} startIcon={<AddCircleIcon />}>Limpar</Button>
            <Button variant="contained" size="small" href={'/admin/usuarios/create'} className={classes.btnSalvar} startIcon={<AddCircleIcon />}>Salvar</Button>
          </Grid>
          {/* <Divider />

        <AccordionActions>
          <Button
            variant="contained"
            className={classes.button}
            startIcon={<ChevronLeftIcon />}
          >Voltar</Button>

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<CachedIcon />}
          >
            Limpar
                        </Button>

          <Button
            variant="contained"

            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleSubmit}>
            Salvar
              </Button>   */}
        </Paper>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  form: {
    '& .MuiFormControl-root': {
      width: '100%',
      margin: theme.spacing(1),
    }
  },
  teste: {
    
      paddingLeft: theme.spacing(1),
    
  },
  pageContent: {
    margin: theme.spacing(15),
    padding: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
  btnSalvar: {
    backgroundColor: "green",
    color: "#FFF",
    "&:hover": {backgroundColor: "#12b912"}
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

  button: {
    margin: theme.spacing(1),
  },
  
  //coloquei agora

  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {

  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));