import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import SaveIcon from '@material-ui/icons/Save';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import BuscarCEP from '../../../components/buscar-cep';
import ListaProdutos from '../../../components/lista-produtos';
import { DatePicker } from '@material-ui/pickers';
import '../../../assets/css/card-location.css';

export default function CreatePedido() {
  const classes = useStyles(); 

  const [status, setStatus] = useState('Pendente');
  const [enderecoAtual, setEnderecoAtual] = useState('atual');
  const [totalGeral, setTotalGeral] = useState(0);
  const [observacao, setObservacao] = useState('');
  const [dataPedido, setDataPedido] = useState();
  const [dataEntrega, setDataEntrega] = useState(null);
  const [dataDevolucao, setDataDevolucao] = useState(null);

  //Dados Endereço
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  //Dados cliente
  const [selectClients, setSelectClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [currentClient, setCurrentClient] = useState({});
  
  //Dados Produto
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function getDadosCliente() {
      
        const results = await api.get('http://localhost:5000/api/clients');
        setSelectClients(results.data);
    }
    
    getDadosCliente();
  }, []);

  function handleSelectClients(e) {
      const clientId = e.target.value;
      setCurrentClient(selectClients.find(e => e._id == clientId));
      setClientId(clientId);
  }

  const handleAddProduto = (produto) => {
    setProdutos([...produtos, produto]);
  } 

  const handleChangeAddress = (event) => {
    setEnderecoAtual(event.target.value);
  };

  async function handleSubmit() {
    const data = {
        nomeCliente: currentClient.nmCliente,
        status: status,
        dataPedido: dataPedido,
        dataEntrega: dataEntrega,
        dataDevolucao: dataDevolucao,
        totalGeral: totalGeral,
        observacao: observacao,

        // nrEndereco: endereco,
        // dsComplemento: complemento,
        // dsLogradouro: logradouro,
        // dsBairro: bairro,
        // dsCidade: cidade,
        // dsUF: uf,
        // nrCEP: cep,

        //Lista de produtos
        products: produtos,
    }
    if (selectClients !== '') {
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

  const handleDateDeliveryChange = (date) => {
      setDataEntrega(date);
  }

  const handleDateDevolutionChange = (date) => {
    setDataDevolucao(date);
  }

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
          <form onSubmit={handleSubmit}>
            <CardContent className={classes.inputs}>
              {/* <FormControl>
                  <FormLabel>Status</FormLabel>
                  <RadioGroup
                      row
                      value={status}
                  >
                      <FormControlLabel value="pendente" disabled control={<Radio />} label="Pendente" />
                  </RadioGroup>
              </FormControl> */}

              <FormControl variant="outlined" size="small" className={classes.formControl}>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                      onChange={handleSelectClients}
                      value={clientId}
                      label="Cliente"
                    >
                      {selectClients.map((clients) => (
                        <MenuItem value={clients._id} key={clients._id}>{clients.nmCliente}</MenuItem>
                      ))}
                  </Select>
              </FormControl> 
              
              <FormControl>
                  <FormLabel></FormLabel>
                  <RadioGroup
                      row
                      value={enderecoAtual}
                      onChange={handleChangeAddress}
                  >
                      <FormControlLabel value="atual" control={<Radio />} label="Endereço atual" />
                      <FormControlLabel value="novo" control={<Radio />} label="Novo endereço" />
                  </RadioGroup>
              </FormControl>

              {enderecoAtual == 'novo' ? <BuscarCEP /> :
                currentClient.nmCliente != null ? 
                <div className='container'>
                  <div className="card">
                    <div className='left-column'>
                      <div>
                        <h4>Endereço de entrega</h4>                    
                      </div>

                      <p>{currentClient.logradouro}, Nº {currentClient.numero}</p>
                      <p>{currentClient.bairro} - {currentClient.cidade}</p>
                      <p>CEP: {currentClient.cep}</p>
                    </div>

                    <div className='right-column'>
                        <img className="img" src={require('../../../assets/Directions-bro.svg')} width={200} height={160} />
                    </div>
                  </div>
                </div> : ""
              }

            <ListaProdutos produtos={produtos} addProduto={handleAddProduto}/>

            <div className={classes.twoInputs}>
              <DatePicker
                label='Data entrega'
                size='small'
                autoOk
                inputVariant='outlined'
                format="dd/MM/yyyy"
                value={dataEntrega}
                onChange={handleDateDeliveryChange}
              />
              
              <DatePicker
                label='Data devolução'
                size='small'
                autoOk
                inputVariant='outlined'
                format="dd/MM/yyyy"
                value={dataDevolucao}
                onChange={handleDateDevolutionChange}
              />
            </div>
            <TextField
              variant="outlined"
              label="Observação"
              multiline
              rows={4}
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
            />
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
              <Button variant="contained" size="medium" className={classes.btnDefaultGreen} type="submit" startIcon={<SaveIcon />}>Salvar</Button>
            </CardActions>
          </form>
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