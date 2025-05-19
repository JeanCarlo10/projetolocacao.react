import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, InputLabel, FormControl, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

export default function EditUsuario() {
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
        <div style={{ display: 'flex' }}>
            <MenuAdmin />
            <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>

                <Container maxWidth="lg" component="main">

                    <CardHeader
                        title="Editar usuário"
                        subheader={
                            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                                <Link color="inherit" href={'/admin/usuarios'}>
                                    Usuários
                                </Link>
                                <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar usuário</Typography>
                            </Breadcrumbs>
                        }
                        titleTypographyProps={{ align: 'left' }}
                        subheaderTypographyProps={{ align: 'left' }}
                        sx={{
                            "& .MuiCardHeader-title": {
                                fontWeight: 700,
                                color: '#212B36',
                                marginBottom: '8px',
                            },
                        }}
                    />

                    <Card style={{ borderRadius: 15 }}>
                        <form onSubmit={handleSubmit}>
                            <CardContent>
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
                                <TextField
                                    required
                                    variant="outlined"
                                    size="small"
                                    type="password"
                                    label="Senha"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                />
                                <FormControl variant="outlined" size="small">
                                    <InputLabel>Tipo de usuário</InputLabel>
                                    <Select
                                        value={tipo}
                                        onChange={e => setTipo(e.target.value)}
                                        label="Tipo de usuário"
                                    >
                                        <MenuItem value="" />
                                        <MenuItem value={1}>Administrador</MenuItem>
                                        <MenuItem value={2}>Funcionário</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
                                <Button variant="contained" size="medium" type="submit">Salvar</Button>
                            </CardActions>
                        </form>
                    </Card>

                </Container>
            </main>
        </div>
    );
}