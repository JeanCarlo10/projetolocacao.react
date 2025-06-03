import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Notification from '../../../components/notification';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    nomeMaterial: yup.string().required("Nome do material obrigatório!")
})

export default function EditMaterial() {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const { idMaterial } = useParams();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        async function getMaterial() {
            var response = await api.get('/api/materials.details/' + idMaterial);

            setValue('nomeMaterial', response.data.nomeMaterial);
        }
        getMaterial();
    }, [idMaterial, setValue]);

    async function submitForm(data) {
        const response = await api.put('/api/materials', {
            ...data,
            _id: idMaterial
        });

        if (response.status === 200) {
            setNotify({
                isOpen: true,
                message: 'Material atualizado com sucesso',
                type: 'success'
            });
            setTimeout(() => {
                window.location.href = '/admin/materiais';
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
                        title="Editar material"
                        subheader={
                            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                                <Link color="inherit" href={'/admin/materiais'} >
                                    Materiais
                                </Link>
                                <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar material</Typography>
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
                            <TextField
                                {...register("nomeMaterial")}
                                error={!!errors.nomeMaterial}
                                helperText={errors.nomeMaterial?.message}
                                autoFocus
                                variant="outlined"
                                size="medium"
                                label="Descrição"
                                fullWidth
                            />
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