import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { TextField, Button, InputAdornment } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import ImageDirection from '../../../assets/img/image-direction.svg';
import NumberFormat from 'react-number-format';
import { useForm, Controller } from "react-hook-form";

export function currencyFormatter(value) {
    if (!Number(value)) return "";

    const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value / 100).replace('R$', '');

    return `${amount}`;
}

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format={currencyFormatter}
        />
    );
});

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

export default function OverviewPedido() {
    const history = useHistory();

    const { idPedido } = useParams();
    const [pedido, setPedido] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const unidadeMedidaMap = { 'Unidade': 'unidade(s)', 'Metro': 'metro(s)' };

    const {
        control,
        reset,
    } = useForm({});

    useEffect(() => {
        const fetchRents = async () => {
            try {
                const res = await api.get('/api/rents/overview/' + idPedido);

                const pedido = res.data;
                setPedido(pedido);
                setProdutos(pedido.products || []);

                reset({
                    dataPedido: pedido.dataPedido,
                    numeroPedido: pedido.numeroPedido,
                    status: pedido.status,
                    dataEntrega: pedido.dataEntrega,
                    dataDevolucao: pedido.dataDevolucao,
                    totalParcial: pedido.totalParcial,
                    desconto: pedido.desconto,
                    totalGeral: pedido.totalGeral,
                    observacao: pedido.observacao,
                    tipoEndereco: pedido.tipoEndereco,
                });

            } catch (error) {
                console.error('Erro ao buscar pedido:', error);
            }
        };
        fetchRents();
    }, [idPedido, reset]);

    if (!pedido) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        )
    }

    const cliente = pedido.idCliente || {};
    
    const endereco = pedido?.tipoEndereco === 'novo'
        ? {
            logradouro: pedido?.logradouro,
            numero: pedido?.numero,
            bairro: pedido?.bairro,
            cidade: pedido?.cidade,
            uf: pedido?.uf,
            cep: pedido?.cep,
            complemento: pedido?.complemento,
        }
        : {
            logradouro: pedido?.idCliente?.logradouro,
            numero: pedido?.idCliente?.numero,
            bairro: pedido?.idCliente?.bairro,
            cidade: pedido?.idCliente?.cidade,
            uf: pedido?.idCliente?.uf,
            cep: pedido?.idCliente?.cep,
            complemento: pedido?.idCliente?.complemento,
        };

    return (
        <div style={{ display: 'flex' }}>
            <MenuAdmin />
            <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>

                <Container maxWidth="lg" component="main">
                    <CardHeader
                        title="Visualizar pedido"
                        subheader={
                            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                                <Link color="inherit" href={'/admin/pedidos'} >
                                    Pedidos
                                </Link>
                                <Typography color="textPrimary" style={{ fontSize: 14 }}>Visualizar pedido</Typography>
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

                    <Box
                        sx={{
                            padding: 2,
                            borderRadius: '10px',
                            border: "1px solid #E0E1E0",
                            boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
                        }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="dataPedido"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="Data do pedido"
                                            value={field.value}
                                            onChange={field.onChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    disabled
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="numeroPedido"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Nº do pedido"
                                            disabled
                                            variant="outlined"
                                            size="medium"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Status"
                                            disabled
                                            variant="outlined"
                                            size="medium"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    label="Cliente"
                                    value={cliente?.tipoPessoa === 'Juridica'
                                        ? cliente?.nomeFantasia || ''
                                        : cliente?.nomeCliente || ''}
                                    fullWidth
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{
                                    padding: 2,
                                    borderRadius: '10px',
                                    border: "2px solid #00AB55",
                                    boxShadow: "0px 2px 4px 0 hsla(0, 0.00%, 0.00%, 0.20)",
                                    marginBottom: 1
                                }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={7} md={9}>
                                            <h2 style={{ color: '#00AB55', marginBottom: 16 }}>Endereço de entrega</h2>

                                            <Box sx={{ fontSize: 18, fontWeight: 700, color: '#3B4251' }}>
                                                <p>{endereco?.logradouro || ''}, Nº {endereco?.numero || ''}</p>
                                                <p>Bairro: {endereco?.bairro || ''} - Cidade: {endereco?.cidade || ''}</p>
                                                <p>Complemento: {endereco?.complemento || ''}</p>
                                                <p>CEP: {endereco?.cep || ''}</p>
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
                                                <StyledTableCell align="left">Produto</StyledTableCell>
                                                <StyledTableCell align="center">Quantidade</StyledTableCell>
                                                <StyledTableCell align="right">Valor</StyledTableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {pedido.products?.map((prod) => (
                                                <StyledTableRow key={prod.id}>
                                                    <StyledTableCell align="left">{prod.nomeMaterial}</StyledTableCell>
                                                    <StyledTableCell align="center">{prod.qtde + " " + unidadeMedidaMap[(prod.unidadeMedida)]}</StyledTableCell>
                                                    <StyledTableCell align="right">R${currencyFormatter(prod.valorItem)}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <Controller
                                    name="dataEntrega"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="Data de entrega"
                                            value={field.value}
                                            onChange={field.onChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    disabled
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <Controller
                                    name="dataDevolucao"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            label="Data de devolução"
                                            value={field.value}
                                            onChange={field.onChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    disabled
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="totalParcial"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            variant="outlined"
                                            size="medium"
                                            disabled
                                            label="Total parcial"
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="desconto"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            disabled
                                            variant="outlined"
                                            size="medium"
                                            label="Desconto"
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="totalGeral"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            variant="outlined"
                                            size="medium"
                                            disabled
                                            label="Total geral"
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <Controller
                                    name="observacao"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Observação"
                                            fullWidth
                                            disabled
                                            multiline
                                            minRows={4}
                                            variant="outlined"
                                            size="medium"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                            <Button variant="contained" size="large" onClick={() => history.goBack()}>Voltar</Button>
                        </div>
                    </Box>
                </Container>
            </main>
        </div >
    );
}