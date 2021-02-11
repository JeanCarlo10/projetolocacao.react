import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputLabel, FormControl, Select } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
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

export default function CreateCliente() {
  const classes = useStyles();

  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipo, setTipo] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [ie, setIe] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');

  async function handleSubmit() {
    const data = {
        nmCliente: nome,
        flSexo: sexo,
        flTipo: tipo,
        nrCPF: cpf,
        nrRG: rg,
        nrIE: ie,
        nrCNPJ: cnpj,
        dtNascimento: nascimento,
        dsEmail: email,
        nrEndereco: endereco,
        dsComplemento: complemento,
        dsLogradouro: logradouro,
        dsBairro: bairro,
        dsCidade: cidade,
        dsUF: uf,
        nrCEP: cep,
        nmRazaoSocial: razaoSocial,
    }

    if (nome != '' && email != '' && tipo != '') {
      const response = await api.post('/api/clients', data);

      if (response.status == 200) {
        window.location.href = '/admin/clientes'
      } else {
        alert('Erro ao cadastrar o cliente');
      }
    } else {
      alert('Campos obrigatórios');
    }
  }

  function handleClear() {
    setNome('');
    setSexo('');
    setTipo('');
    setCpf('');
    setRg('');
    setIe('');
    setCnpj('');
    setNascimento('');
    setEmail('');
    setEndereco('');
    setComplemento('');
    setLogradouro('');
    setBairro('');
    setCidade('');
    setUf('');
    setCep('');
    setRazaoSocial('');
  }

  return (
    <div className={classes.root}>
      <MenuAdmin/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" className={classes.container}>
        <Card>
          <CardHeader
            title="Cadastrar clientes"
            subheader={
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/clientes'} >
                Clientes
              </Link>
              <Typography color="textPrimary">Cadastrar cliente</Typography>
            </Breadcrumbs>
            }
            titleTypographyProps={{ align: 'left' }}
            subheaderTypographyProps={{ align: 'left' }}
            className={classes.cardHeader}
          />
          <CardContent className={classes.inputs}>
          
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="tipo">Tipo</InputLabel>
                <Select
                    id="tipo"
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    label="Tipo de pessoa"
                  >
                  <MenuItem value="" />
                  <MenuItem  value={1}>Pessoa Física</MenuItem>
                  <MenuItem  value={2}>Pessoa Jurídica</MenuItem>
                </Select>
            </FormControl> 

            
            <TextField
              required
              variant="outlined"
              id="nome"
              name="nome"
              label="Nome cliente"
              autoComplete="nome"
              autoFocus
              value={nome}
              onChange={e => setNome(e.target.value)}
            />

            <div className={classes.twoInputs}>
              <TextField
                variant="outlined"
                required
                id="nascimento"
                name="nascimento"
                label="Data de nascimento"
                value={nascimento}
                onChange={e => setNascimento(e.target.value)}
              />
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="sexo">Sexo</InputLabel>
                <Select
                    id="sexo"
                    value={sexo}
                    onChange={e => setSexo(e.target.value)}
                    label="Sexo"
                  >
                  <MenuItem value="" />
                  <MenuItem  value={10}>Feminino</MenuItem>
                  <MenuItem  value={20}>Masculino</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.twoInputs}>
              <TextField
                variant="outlined"
                required
                id="cpf"
                name="cpf"
                label="CPF"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
              />
              <TextField
                variant="outlined"
                required
                id="rg"
                name="rg"
                label="RG"
                value={rg}
                onChange={e => setRg(e.target.value)}
              />
            </div>
            
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
            
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button variant="contained" size="small" className={classes.button} color='default' href={'/admin/clientes'} startIcon={<ArrowBackIcon />}>Voltar</Button>
            <Button variant="contained" size="small"  className={classes.button} color='primary' onClick={handleClear} startIcon={<CachedIcon />}>Limpar</Button>
            <Button variant="contained" size="small" href={'/admin/clientes'} className={classes.btnSalvar} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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