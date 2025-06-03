import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, InputLabel, Box, Grid, FormControl, Select, InputAdornment, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Notification from '../../../components/notification';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    nomeUsuario: yup.string()
        .required("Nome do usuário obrigatório!"),

    tipoUsuario: yup.string()
        .required("Tipo de usuário obrigatório!"),

    email: yup.string()
        .required("Email obrigatório!"),

    senha: yup.string()
        .required("Senha obrigatória!"),
})

export default function EditUsuario() {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const { idUsuario } = useParams();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            tipoUsuario: '',
        },
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        async function getUsuario() {
            var response = await api.get('/api/users.details/' + idUsuario);

            setValue('nomeUsuario', response.data.nomeUsuario);
            setValue('email', response.data.email);
            setValue('senha', response.data.senha);
            setValue('tipoUsuario', response.data.tipoUsuario);
        }

        getUsuario();
    }, [idUsuario, setValue])

    async function submitForm(data) {
        const response = await api.put('/api/users', {
            ...data,
            _id: idUsuario
        });

        if (response.status === 200) {
            setNotify({
                isOpen: true,
                message: 'Usuário atualizado com sucesso',
                type: 'success'
            });
            setTimeout(() => {
                window.location.href = '/admin/usuarios';
            }, 2500);
        } else {
            alert('Erro! contate o administrador do sistema');
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <Notification notify={notify} setNotify={setNotify} />
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

                    <Box sx={{
                        padding: 2,
                        borderRadius: '10px',
                        border: "1px solid #E0E1E0",
                        boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
                    }}>
                        <form onSubmit={handleSubmit(submitForm)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3} md={3}>
                                    <Controller
                                        name="tipoUsuario"
                                        control={control}
                                        defaultValue="Administrador"
                                        render={({ field, fieldState }) => (
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                            >
                                                <InputLabel>Tipo de usuario</InputLabel>
                                                <Select
                                                    label="Tipo de usuario*"
                                                    value={field.value}
                                                    onChange={(e) => { field.onChange(e); }}
                                                >
                                                    <MenuItem value="Administrador">Administrador</MenuItem>
                                                    <MenuItem value="Colaborador">Colaborador</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={9} md={9}>
                                    <Controller
                                        name="nomeUsuario"
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Nome do usuário*"
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Email*"
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Controller
                                        name="senha"
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Senha*"
                                                fullWidth
                                                type={showPassword ? 'text' : 'password'}
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                                <Button variant="contained" size="large" type="submit">Salvar</Button>
                            </div>
                        </form>
                    </Box>

                </Container>
            </main>
        </div>
    );
}