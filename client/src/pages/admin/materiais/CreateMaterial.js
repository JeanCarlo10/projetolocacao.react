import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Notification from '../../../components/notification';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  nomeMaterial: yup.string().required("Nome do material obrigatório!")
})

export default function CreateMaterial() {
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  async function submitForm(data) {
    const response = await api.post('/api/materials', data);

    if (response.status === 200) {
      setNotify({
        isOpen: true,
        message: 'Cadastro realizado com sucesso.',
        type: 'success'
      });
      setTimeout(() => {
        window.location.href = '/admin/materiais';
      }, 2500);
    }
    else {
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
            title="Cadastrar materiais"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin/materiais'} >
                  Materiais
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Cadastrar material</Typography>
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
                variant="outlined"
                size="medium"
                fullWidth
                label="Descrição"
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