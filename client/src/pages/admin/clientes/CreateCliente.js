import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputLabel, FormControl, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import BuscarCEP from '../../../components/buscar-cep';
import ListaContatos from '../../../components/lista-contatos';

export default function CreateCliente() {
  const classes = useStyles(); 

  const [nome, setNome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipo, setTipo] = useState(1);
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [ie, setIe] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [nrEndereco, setNrEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

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
        nrEndereco: nrEndereco,
        dsComplemento: complemento,
        dsLogradouro: logradouro,
        dsBairro: bairro,
        dsCidade: cidade,
        dsUF: uf,
        nrCEP: cep,
        nmRazaoSocial: razaoSocial,

        
    }
    if (nome !== '' && email != '' && tipo != '') {
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

  return (
    <div className={classes.root}>
      <MenuAdmin/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" className={classes.container}>
        
          <CardHeader
            title="Cadastrar cliente"
            subheader={
            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/clientes'} >
                Clientes
              </Link>
              <Typography color="textPrimary" style={{ fontSize: 14 }}>Cadastrar cliente</Typography>
            </Breadcrumbs>
            }
            titleTypographyProps={{ align: 'left' }}
            subheaderTypographyProps={{ align: 'left' }}
            className={classes.cardHeader}
          />
          <Card style= {{ borderRadius: 15 }}>
          <CardContent className={classes.inputs}>
          
            <FormControl variant="outlined" size="small" className={classes.formControl}>
                <InputLabel id="tipo" >Tipo</InputLabel>
                <Select
                    id="tipo"
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    label="Tipo de pessoa"
                  >
                  <MenuItem  value={1}>Pessoa Física</MenuItem>
                  <MenuItem  value={2}>Pessoa Jurídica</MenuItem>
                </Select>
            </FormControl> 

            {tipo == 1 && 
              <TextField
                variant="outlined"
                id="nome"
                name="nome"
                label="Nome cliente"
                autoComplete="nome"
                size="small"
                autoFocus
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            }

            {tipo == 2 && 
              <TextField
                variant="outlined"
                id="razaoSocial"
                name="razaoSocial"
                label="Razão Social"
                autoComplete="razaosocial"
                size="small"
                autoFocus
                value={razaoSocial}
                onChange={e => setRazaoSocial(e.target.value)}
              />
            }

            {tipo == 1 && 
              <div className={classes.twoInputs}>
                <TextField
                  required
                  variant="outlined"
                  size="small"
                  id="nascimento"
                  name="nascimento"
                  label="Data de nascimento"
                  value={nascimento}
                  onChange={e => setNascimento(e.target.value)}
                />
                <FormControl variant="outlined" size="small" className={classes.formControl}>
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
            }
            
            <div className={classes.twoInputs}>
            {tipo == 1 && 
              <TextField
                variant="outlined"
                size="small"
                required
                id="cpf"
                name="cpf"
                label="CPF"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
              />
            }

            {tipo == 2 && 
              <TextField
                variant="outlined"
                size="small"
                required
                id="cnpj"
                name="cnpj"
                label="CNPJ"
                value={cnpj}
                onChange={e => setCnpj(e.target.value)}
              />
            }
            
            {tipo == 1 && 
              <TextField 
                className={classes.formControl}
                variant="outlined"
                size="small"
                id="rg"
                name="rg"
                label="RG"
                value={rg}
                onChange={e => setRg(e.target.value)}
              />
            }
            {tipo == 2 && 
              <TextField 
                className={classes.formControl}
                variant="outlined"
                size="small"
                id="ie"
                name="ie"
                label="IE"
                value={ie}
                onChange={e => setIe(e.target.value)}
              />
            }
          </div>
            
            <TextField
              required
              size="small"
              variant="outlined"
              id="email"
              name="email"
              label="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <BuscarCEP /> 
            <ListaContatos /> 

          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
            <Button variant="contained" size="medium" href={'/admin/clientes'} className={classes.btnDefaultGreen} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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
    "& .MuiCardHeader-title": {
      fontWeight: 700,
      color: '#212B36',
      marginBottom: theme.spacing(1),
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
    },

    '& label.Mui-focused': {
      color: '#00AB55',
    },
    '& .MuiOutlinedInput-root': {
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
  
  appBarSpacer: theme.mixins.toolbar,
}));