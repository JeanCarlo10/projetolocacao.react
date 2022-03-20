import React, { useState, useEffect } from 'react';
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
import { IconButton } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import SaveIcon from '@material-ui/icons/Save';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { NavigateNextOutlined } from '@material-ui/icons';
import BuscarCEP from '../../../components/buscar-cep';
import ListaContatos from '../../../components/lista-contatos';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';



export default function CreatePedido() {
  const classes = useStyles(); 

  const [dadosCliente, setDadosCliente] = useState();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const getDados = async () => {
      
        let results = api.post('http://localhost:5000/api/clients');
        setClients(results);
    }
    
    getDados();
  }, [])


  useEffect(() => {
    fetch("/api/clients", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        setClients(data)
    })
    .catch((err) => console.log(err))
  }, []);

  function handleSelectClients(e) {
      setClients({ 
          clientes: {
              id: e.target.value,
              name: e.target.options[e.target.selectedIndex].text,
          }
      })
      console.log(clients)
  }

  const [status, setStatus] = useState('entrega');
  const [enderecoAtual, setEnderecoAtual] = useState('atual');
  const [vlTotalGeral, setVlTotalGeral] = useState(0);
  const [dsObservacao, setDsObservacao] = useState('');

  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  async function handleSubmit() {
    const data = {
        nmCliente: clients,
        status: status,
        vlTotalGeral: vlTotalGeral,

        nrEndereco: endereco,
        dsComplemento: complemento,
        dsLogradouro: logradouro,
        dsBairro: bairro,
        dsCidade: cidade,
        dsUF: uf,
        nrCEP: cep,
    }
    if (clients !== '') {
      const response = await api.post('/api/rents', data);

      if (response.status == 200) {
        window.location.href = '/admin/pedidos'
      } else {
        alert('Erro ao cadastrar o pedido');
      }
    } else {
      alert('Campos obrigatórios');
    }
  }

  const handleChange = (event) => {
    setStatus(event.target.value);
    setEnderecoAtual(event.target.value);
  };

  return (
    <div className={classes.root}>
      <MenuAdmin/>
      <main className={classes.content}>

      <Container maxWidth="lg" component="main" className={classes.container}>
        
          <CardHeader
            title="Cadastrar pedido"
            subheader={
            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
              <Link color="inherit" href={'/admin/pedidos'} >
                Pedidos
              </Link>
              <Typography color="textPrimary" style={{ fontSize: 14 }}>Cadastrar pedido</Typography>
            </Breadcrumbs>
            }
            titleTypographyProps={{ align: 'left' }}
            subheaderTypographyProps={{ align: 'left' }}
            className={classes.cardHeader}
          />
          <Card style= {{ borderRadius: 15 }}>
          <CardContent className={classes.inputs}>
          
            <FormControl>
                <FormLabel id="status">Status</FormLabel>
                <RadioGroup
                    row
                    name="status"
                    value={status}
                    onChange={handleChange}
                >
                    <FormControlLabel value="entrega" control={<Radio />} label="Entrega" />
                    <FormControlLabel value="retirada" control={<Radio />} label="Retirada" />
                </RadioGroup>
            </FormControl>

            

            <FormControl variant="outlined" size="small" className={classes.formControl}>
                <InputLabel id="clients" >Cliente</InputLabel>
                <Select
                    id="clients"
                    // value={clients}
                    onChange={handleSelectClients}
                    label="Cliente"
                  >
                  <MenuItem>{clients}</MenuItem>
                </Select>
            </FormControl> 
            
            <FormControl>
                <FormLabel id="enderecoAtual"></FormLabel>
                <RadioGroup
                    row
                    name="enderecoAtual"
                    value={enderecoAtual}
                    onChange={handleChange}
                >
                    <FormControlLabel value="atual" control={<Radio />} label="Endereço atual" />
                    <FormControlLabel value="novo" control={<Radio />} label="Novo endereço" />
                </RadioGroup>
            </FormControl>

            {enderecoAtual == 'novo' ? <BuscarCEP /> : <div>
              
                <LocationOnOutlinedIcon style={{color: '#CDCDCD', fontSize: 40 }}/> Avenida Nacional, 482 - Três Bandeiras
            </div>
            }

          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
            <Button variant="contained" size="medium" href={'/admin/pedidos'} className={classes.btnDefaultGreen} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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