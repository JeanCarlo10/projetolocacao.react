import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

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

export default function CreateMaterial() {
  const classes = useStyles();

  const [nmMaterial, setNmMaterial] = useState('');

  async function handleSubmit() {
    const data = {
      nmMaterial: nmMaterial,
    }
    if (nmMaterial != '' ) {
      const response = await api.post('/api/materials', data);

      if (response.status == 200) {
        window.location.href = '/admin/materiais'
      } else {
        alert('Erro ao cadastrar o material');
      }
    } else {
      alert('Campos obrigatórios');
    }
  }

  function handleClear() {
    setNmMaterial('');
  }

  return (
    <div className={classes.root}>
      <MenuAdmin/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" className={classes.container}>
        <Card>
          <CardHeader
            title="Cadastrar materiais"
            subheader={
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/materiais'} >
                Materiais
              </Link>
              <Typography color="textPrimary">Cadastrar material</Typography>
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
              id="nmMaterial"
              name="nmMaterial"
              label="Nome material"
              autoFocus
              value={nmMaterial}
              onChange={e => setNmMaterial(e.target.value)}
            />
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button variant="contained" size="small" className={classes.button} color='default' href={'/admin/materiais'} startIcon={<ArrowBackIcon />}>Voltar</Button>
            <Button variant="contained" size="small"  className={classes.button} color='primary' onClick={handleClear} startIcon={<CachedIcon />}>Limpar</Button>
            <Button variant="contained" size="small" href={'/admin/materiais'} className={classes.btnSalvar} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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