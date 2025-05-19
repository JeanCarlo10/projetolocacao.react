import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { TextField, Button, Chip, Container, Breadcrumbs, Avatar } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import api from '../../../services/api';
import { mask, unMask } from 'remask';
import MenuAdmin from '../../../components/menu-admin';
import ImageDirection from '../../../assets/img/image-direction.svg';
import { useForm, Controller } from "react-hook-form";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Nunito',

  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700,
    color: '#000',
    paddingTop: 6,
    paddingBottom: 6,
    background: '#D2D2D2',
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#3B4251',
    fontWeight: 500,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function OverviewCliente() {
  const history = useHistory();
  const { idCliente } = useParams();

  const [cliente, setCliente] = useState(null);
  const [contacts, setContacts] = useState([]);

  const {
    control,
    reset,
    watch,
  } = useForm({});

  const tipoPessoa = watch("tipoPessoa");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/api/clients/overview/' + idCliente);

        const cliente = res.data;
        setCliente(cliente);
        setContacts(cliente.contacts || []);

        reset({
          tipoPessoa: cliente.tipoPessoa,
          nomeCliente: cliente.nomeCliente,
          sexo: cliente.sexo,
          cpf: cliente.cpf,
          rg: cliente.rg,
          dataNascimento: cliente.dataNascimento,
          nomeFantasia: cliente.nomeFantasia,
          cnpj: cliente.cnpj,
          ie: cliente.ie,
          email: cliente.email,
          foto: cliente.foto,

          logradouro: cliente.logradouro,
          numero: cliente.numero,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          uf: cliente.uf,
          cep: cliente.cep,
        });
      } catch (error) {
        console.error('Erro ao buscar cliente:', error.response?.data || error.message);
      }
    };
    fetchClients();
  }, [idCliente, reset]);

  if (!cliente) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdmin />
      <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>

        <Container maxWidth="lg" component="main">
          <CardHeader
            title="Visualizar cliente"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin/clientes'} >
                  Clientes
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Visualizar cliente</Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                {cliente?.foto && (
                  <Avatar
                    src={process.env.REACT_APP_API_URL + cliente.foto}
                    alt="Foto do cliente"
                    sx={{
                      borderRadius: '16px',
                      width: 150,
                      height: 150,
                      border: '4px solid #DDDDDD',
                    }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Controller
                  name="tipoPessoa"
                  control={control}
                  render={({ field, fieldState }) => {
                    const tipoFormatado =
                      field.value === 'Fisica'
                        ? 'Pessoa física'
                        : field.value === 'Juridica'
                          ? 'Pessoa jurídica'
                          : '';
                    return (
                      <TextField
                        {...field}
                        value={tipoFormatado}
                        fullWidth
                        disabled
                        label="Tipo de pessoa"
                        variant="outlined"
                        size="medium"
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                {tipoPessoa === 'Fisica' &&
                  <Controller
                    name="nomeCliente"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        disabled
                        label="Nome do cliente"
                        variant="outlined"
                        size="medium"
                      />
                    )}
                  />
                }

                {tipoPessoa === 'Juridica' &&
                  <Controller
                    name="nomeFantasia"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        disabled
                        label="Nome fantasia"
                        variant="outlined"
                        size="medium"
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
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          disabled
                          fullWidth
                          variant="outlined"
                          label="CPF"
                          size="medium"
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled
                          label="RG"
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
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled
                          label="Data de nascimento"
                          variant="outlined"
                          size="medium"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      name="sexo"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled
                          label="Sexo"
                          variant="outlined"
                          size="medium"
                        />
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
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          label="CNPJ"
                          fullWidth
                          disabled
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled
                          label="IE"
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled
                      label="Email"
                      variant="outlined"
                      size="medium"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Box sx={{
                  padding: 2,
                  borderRadius: '10px',
                  border: "2px solid #00AB55",
                  boxShadow: "0px 2px 4px 0 hsla(0, 0.00%, 0.00%, 0.20)",
                  marginBottom: 1
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7} md={9}>
                      <h2 style={{ color: '#00AB55', marginBottom: 16 }}>Meu endereço</h2>

                      <Box sx={{ fontSize: 18, fontWeight: 700, color: '#3B4251' }}>
                        <p>{cliente?.logradouro || ''}, Nº {cliente?.numero || ''}</p>
                        <p>Bairro: {cliente?.bairro || ''} - Cidade: {cliente?.cidade || ''}</p>
                        <p>Complemento: {cliente?.complemento || ''}</p>
                        <p>CEP: {cliente?.cep || ''}</p>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={5} md={3}>
                      <Box
                        sx={{
                          display: { xs: 'none', sm: 'flex' }, justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%'
                        }}>
                        <img src={ImageDirection} height={180} alt="Mapa" />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TableContainer style={{ borderRadius: 10 }}>
                  <Table style={{ minWidth: 500 }} size="medium">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Tipo</StyledTableCell>
                        <StyledTableCell align="center">Número</StyledTableCell>
                        <StyledTableCell align="left">Observação</StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {contacts.map((contact) => (
                        <StyledTableRow key={contact.id}>
                          <StyledTableCell align="center"><Chip label={contact.tipoTelefone} /></StyledTableCell>
                          <StyledTableCell align="center">{contact.numero}</StyledTableCell>
                          <StyledTableCell align="left">{contact.observacao}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Button variant="contained" size="large" onClick={() => history.goBack()}>Voltar</Button>
            </div>
          </Box>
        </Container>
      </main>
    </div>
  );
}