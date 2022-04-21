import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, InputLabel, FormControl, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import SaveIcon from '@material-ui/icons/Save';

import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

import BuscarCEP from '../../../components/buscar-cep';
import ListaContatos from '../../../components/lista-contatos';
import { mask, unMask } from 'remask';

export default function EditCliente() {
    const classes = useStyles();

    const [nome, setNome] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [sexo, setSexo] = useState('');
    const [tipo, setTipo] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [ie, setIe] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [email, setEmail] = useState('');
    const [dadosEndereco, setDadosEndereco] = useState({});
    const [contatos, setContatos] = useState([]);
    const { idCliente } = useParams();

    useEffect(() => {
        async function getCliente() {
            var response = await api.get('/api/clients.details/' + idCliente);

            setNome(response.data.nmCliente);
            setRazaoSocial(response.data.nmRazaoSocial);
            setSexo(response.data.flSexo);
            setTipo(response.data.flTipo);
            setCpf(response.data.nrCPF);
            setRg(response.data.nrRG);
            setIe(response.data.nrIE);
            setCnpj(response.data.nrCNPJ);
            setNascimento(response.data.dtNascimento);
            setEmail(response.data.dsEmail);
            setContatos(response.data.contacts);
        }
        getCliente();
    }, [])

    const handleSearchCEP = (data) => {
        setDadosEndereco(data);
    }

    const handleAddContato = (contato) => {
        setContatos([...contatos, contato]);
    } 

    const handleChangeCPF = (event) => {
        setCpf(mask(unMask(event.target.value), ['999.999.999-99']));
    }
    
    const handleChangeCNPJ = (event) => {
        setCnpj(mask(unMask(event.target.value), ['99.999.999/9999-99']));
    }
    
    const handleChangeDataNascimento = (event) => {
        setNascimento(mask(unMask(event.target.value), ['99/99/9999']));
    }

    async function handleSubmit() {
        const data = {
            _id: idCliente,
            nmCliente: nome,
            flSexo: sexo,
            flTipo: tipo,
            nrCPF: cpf,
            nrRG: rg,
            nrIE: ie,
            nrCNPJ: cnpj,
            dtNascimento: nascimento,
            dsEmail: email,

            //Dados Endereço
            numero: dadosEndereco.numero,
            complemento: dadosEndereco.complemento,
            logradouro: dadosEndereco.logradouro,
            bairro: dadosEndereco.bairro,
            cidade: dadosEndereco.cidade,
            uf: dadosEndereco.uf,
            cep: dadosEndereco.cep,
            
            //Dados Contatos
            contacts: contatos,
        }

        if (nome != '' && tipo != '') {
            const response = await api.put('/api/clients', data);

            if (response.status == 200) {
                window.location.href = '/admin/clientes'
            } else {
                alert('Erro ao atualizar o cliente');
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
                    title="Editar cliente"
                    subheader={
                    <Breadcrumbs style={{ fontSize: 14 }} separator="•"  aria-label="breadcrumb">
                    <Link color="inherit" href={'/admin/clientes'} >
                        Clientes
                    </Link>
                    <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar cliente</Typography>
                    </Breadcrumbs>
                    }
                    titleTypographyProps={{ align: 'left' }}
                    subheaderTypographyProps={{ align: 'left' }}
                    className={classes.cardHeader}
                />
                
                <Card style= {{ borderRadius: 15 }}>
                    <form onSubmit={handleSubmit}>
                        <CardContent className={classes.inputs}>
                            <FormControl disabled variant="outlined" size="small" className={classes.formControl}>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={tipo}
                                    onChange={e => setTipo(e.target.value)}
                                    label="Tipo de pessoa"
                                >
                                <MenuItem value="" />
                                <MenuItem  value={1}>Pessoa Física</MenuItem>
                                <MenuItem  value={2}>Pessoa Jurídica</MenuItem>
                                </Select>
                            </FormControl> 

                            {tipo == 1 && 
                                <TextField
                                    variant="outlined"
                                    label="Nome cliente"
                                    size="small"
                                    autoFocus
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                />
                            }   

                            {tipo == 2 && 
                                <TextField
                                    variant="outlined"
                                    label="Razão Social"
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
                                        label="Data de nascimento"
                                        value={nascimento}
                                        onChange={handleChangeDataNascimento}
                                    />
                                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                                        <InputLabel>Sexo</InputLabel>
                                        <Select
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
                                        label="CPF"
                                        value={cpf}
                                        onChange={handleChangeCPF}
                                    />
                                }

                                {tipo == 2 && 
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        required
                                        label="CNPJ"
                                        value={cnpj}
                                        onChange={handleChangeCNPJ}
                                    />
                                }

                                {tipo == 1 && 
                                    <TextField 
                                        className={classes.formControl}
                                        variant="outlined"
                                        size="small"
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
                                        label="IE"
                                        value={ie}
                                        onChange={e => setIe(e.target.value)}
                                    />
                                }
                            </div>
                    
                            <TextField
                                size="small"
                                variant="outlined"
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <BuscarCEP getDados={dadosEndereco} onUpdate={handleSearchCEP} /> 
                            <ListaContatos contatos={contatos} addContato={handleAddContato}  /> 

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