import React, { useState, useEffect } from 'react';
import { TextField, FormHelperText, InputLabel, FormControl, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import api from '../../../services/api';
import { mask, unMask } from 'remask';
import Swal from 'sweetalert2';
import MenuAdmin from '../../../components/menu-admin';
import BuscarCEP from '../../../components/buscar-cep';
import ListaContatos from '../../../components/lista-contatos';
import Notification from '../../../components/notification';
import CameraCapture from '../../../components/camera-capture';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  nomeCliente: yup.string().when("tipoPessoa", {
    is: 'Fisica',
    then: () => yup.string().required("Nome do cliente obrigatório!"),
  }),

  nomeFantasia: yup.string().when("tipoPessoa", {
    is: 'Juridica',
    then: () => yup.string().required("Nome fantasia obrigatório!"),
  }),

  cpf: yup.string().when("tipoPessoa", {
    is: 'Fisica',
    then: () => yup
      .string()
      .required("CPF obrigatório!")
      .test("len", "CPF deve conter 11 dígitos", (val) => val?.length === 11),
  }),

  cnpj: yup.string().when("tipoPessoa", {
    is: "Juridica",
    then: () => yup
      .string()
      .required("CNPJ obrigatório!")
      .test("len", "CNPJ deve conter 14 dígitos", (val) => val?.length === 14),
  }),

  contacts: yup.array().min(1, 'Informe pelo menos um contato.').required("Informe pelo menos um contato."),
})

export default function CreateCliente() {
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [contacts, setContacts] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  });

  const [photo, setPhoto] = useState();
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [fotoBase64, setFotoBase64] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tipoPessoa: 'Fisica',
    },
    resolver: yupResolver(schema)
  });

  const tipoPessoa = watch("tipoPessoa");

  const handleTipoPessoaChange = (e) => {
    const newType = e.target.value;

    if (newType === 'Fisica') {
      setValue("nomeFantasia", "");
      setValue("cnpj", "");
      setValue("ie", "");
    } else if (newType === "Juridica") {
      setValue("nomeCliente", "");
      setValue("cpf", "");
      setValue("rg", "");
      setValue("sexo", "");
      setValue("dataNascimento", "");
    }
  };

  const handleEnderecoFieldChange = (field, value) => {
    setDadosEndereco((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddContact = (contact) => {
    const isDuplicate = contacts.some(c => c.numero === contact.numero);

    if (isDuplicate) {
      Swal.fire('Atenção!', 'Contato já adicionado.', 'warning');
      return;
    }

    const newContacts = [...contacts, contact];
    setContacts(newContacts);
  }

  const handleDeleteContact = (idContact) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== idContact)
    );
  }

  const handleRemovePhoto = () => {
    setFotoBase64(null);
    setPhoto(null);
    setPhotoRemoved(true);
  };

  useEffect(() => {
    setValue('contacts', contacts);
  }, [contacts, setValue]);

  async function submitForm(dataForm) {
    const cleanedContacts = contacts.map(({ id, tipoTelefone, numero, observacao }) => ({
      id,
      tipoTelefone,
      numero,
      observacao,
    }));

    const formData = new FormData();

    // Adiciona campos principais
    formData.append('tipoPessoa', dataForm.tipoPessoa);
    formData.append('nomeCliente', dataForm.nomeCliente);
    formData.append('sexo', dataForm.sexo);
    formData.append('cpf', dataForm.cpf);
    formData.append('rg', dataForm.rg);
    formData.append('dataNascimento', dataForm.dataNascimento);
    formData.append('nomeFantasia', dataForm.nomeFantasia);
    formData.append('cnpj', dataForm.cnpj);
    formData.append('ie', dataForm.ie);
    formData.append('email', dataForm.email);

    // Adiciona os dados de endereço
    formData.append('logradouro', dadosEndereco.logradouro);
    formData.append('numero', dadosEndereco.numero);
    formData.append('complemento', dadosEndereco.complemento);
    formData.append('bairro', dadosEndereco.bairro);
    formData.append('cidade', dadosEndereco.cidade);
    formData.append('uf', dadosEndereco.uf);
    formData.append('cep', dadosEndereco.cep);

    // Adiciona os contatos (array para string JSON)
    formData.append('contacts', JSON.stringify(cleanedContacts));

    if (photoRemoved) {
      formData.append('removePhoto', 'true');
    }

    // Adiciona a imagem (se houver)
    if (fotoBase64) {
      const blob = await fetch(fotoBase64).then(res => res.blob());
      const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });

      formData.append('foto', file);
    }

    try {
      const response = await api.post('/api/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setNotify({
          isOpen: true,
          message: 'Cadastro realizado com sucesso.',
          type: 'success'
        });

        setTimeout(() => {
          window.location.href = '/admin/clientes'
        }, 2500);
      } else {
        setNotify({
          isOpen: true,
          message: 'Erro ao cadastrar cliente. Tente novamente.',
          type: 'error'
        });
      }
    } catch (error) {
      setNotify({
        isOpen: true,
        message: 'Erro no servidor. Contate o administrador.',
        type: 'error'
      });
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Notification notify={notify} setNotify={setNotify} />
      <MenuAdmin />
      <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>

        <Container maxWidth="lg" component="main">
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
          />

          <Box sx={{
            padding: 2,
            borderRadius: '10px',
            border: "1px solid #E0E1E0",
            boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
          }}>
            <form onSubmit={handleSubmit(submitForm)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <CameraCapture
                    onCapture={(base64) => {
                      setPhoto(base64);
                      setFotoBase64(base64);
                      setPhotoRemoved(false);
                    }}
                    onRemove={handleRemovePhoto}
                    defaultPhoto={null}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    name="tipoPessoa"
                    control={control}
                    defaultValue="Fisica"
                    render={({ field, fieldState }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="medium"
                        error={!!fieldState.error}
                      >
                        <InputLabel>Tipo de pessoa</InputLabel>
                        <Select
                          label="Tipo de pessoa"
                          value={field.value}
                          onChange={(e) => { field.onChange(e); handleTipoPessoaChange(e) }}
                        >
                          <MenuItem value="Fisica">Pessoa física</MenuItem>
                          <MenuItem value="Juridica">Pessoa jurídica</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  {tipoPessoa === 'Fisica' &&
                    <Controller
                      name="nomeCliente"
                      control={control}
                      defaultValue=""
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Nome do cliente*"
                          fullWidth
                          variant="outlined"
                          size="medium"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  }

                  {tipoPessoa === 'Juridica' &&
                    <Controller
                      name="nomeFantasia"
                      control={control}
                      defaultValue=""
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Nome fantasia*"
                          fullWidth
                          variant="outlined"
                          size="medium"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  }
                </Grid>

                {tipoPessoa === 'Fisica' &&
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="cpf"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            variant="outlined"
                            label="CPF*"
                            fullWidth
                            value={mask(field.value ?? '', ['999.999.999-99'])}
                            onChange={(e) => {
                              let raw = unMask(e.target.value).slice(0, 11);
                              field.onChange(raw);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="rg"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="RG"
                            fullWidth
                            variant="outlined"
                            size="medium"
                          />
                        )}
                      />
                    </Grid>
                  </>
                }

                {tipoPessoa === 'Fisica' &&
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="dataNascimento"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Data de nascimento"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            value={mask(unMask(field.value || ""), ["99/99/9999"])}
                            onChange={(e) => field.onChange(unMask(e.target.value))}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="sexo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl fullWidth variant="outlined" size="medium">
                            <InputLabel>Sexo</InputLabel>
                            <Select
                              label="Sexo"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <MenuItem value="" />
                              <MenuItem value="Feminino">Feminino</MenuItem>
                              <MenuItem value="Masculino">Masculino</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </>
                }

                {tipoPessoa === 'Juridica' &&
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="cnpj"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            variant="outlined"
                            label="CNPJ*"
                            fullWidth
                            value={mask(field.value ?? '', ['99.999.999/9999-99'])}
                            onChange={(e) => {
                              let raw = unMask(e.target.value).slice(0, 14);
                              field.onChange(raw);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <Controller
                        name="ie"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="IE"
                            fullWidth
                            variant="outlined"
                            size="medium"
                          />
                        )}
                      />
                    </Grid>
                  </>
                }

                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        variant="outlined"
                        size="medium"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <BuscarCEP onFieldChange={handleEnderecoFieldChange} initialData={dadosEndereco} />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <ListaContatos contacts={contacts} addContact={handleAddContact} deleteContact={handleDeleteContact} />
                  {errors.contacts && (
                    <FormHelperText error
                      sx={{
                        border: '1px solid #FF5B5B',
                        background: '#FFE1E1',
                        borderRadius: 2,
                        padding: 1,
                        marginTop: 1,
                        fontSize: 14,
                        fontWeight: 600
                      }}>
                      {errors.contacts.message}
                    </FormHelperText>
                  )}
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