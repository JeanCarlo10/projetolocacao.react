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

export default function EditUsuario() {
    const classes = useStyles();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');

    const { idUsuario } = useParams();

    useEffect(() => {
        async function getUsuario() {
            var response = await api.get('/api/users.details/' + idUsuario);

            setNome(response.data.nmUsuario);
            setEmail(response.data.dsEmail);
            setSenha(response.data.senha);
            setTipo(response.data.flUsuario);
        }

        getUsuario();
    }, [])

    function handleClear() {
        setNome('');
        setEmail('');
        setSenha('');
        setTipo('');
    }

    async function handleSubmit() {
        const data = {
            nmUsuario: nome,
            dsEmail: email,
            flUsuario: tipo,
            senha: senha,
            _id: idUsuario
        }

        if (nome != '' && email != '' && tipo != '' && senha != '') {
            const response = await api.put('/api/users', data);

            if (response.status == 200) {
                window.location.href = '/admin/usuarios'
            } else {
                alert('Erro ao atualizar o usuário');
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
                    title="Editar usuário"
                    subheader={
                    <Breadcrumbs style={{ fontSize: 14 }} separator="•"  aria-label="breadcrumb">
                    <Link color="inherit" href={'/admin/usuarios'}>
                        Usuários
                    </Link>
                    <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar usuário</Typography>
                    </Breadcrumbs>
                    }
                    titleTypographyProps={{ align: 'left' }}
                    subheaderTypographyProps={{ align: 'left' }}
                    className={classes.cardHeader}
                />
                
                <Card style= {{ borderRadius: 15 }}>
                    <CardContent className={classes.inputs}>
                        <TextField
                            required
                            autoFocus
                            variant="outlined"
                            size="small"
                            label="Nome usuário"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                        <TextField
                            required
                            variant="outlined"
                            size="small"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className={classes.twoInputs}>
                            <TextField
                                required
                                variant="outlined"
                                size="small"
                                type="password"
                                label="Senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                            />
                            <FormControl variant="outlined" size="small" className={classes.formControl}>
                                <InputLabel>Tipo de usuário</InputLabel>
                                <Select
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
                    <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
                        <Button variant="contained" size="medium" href={'/admin/usuarios'} className={classes.btnDefaultGreen} onClick={handleSubmit} startIcon={<SaveIcon />}>Salvar</Button>
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