import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Typography, InputAdornment, FormHelperText, Select, InputLabel, Radio, RadioGroup, FormControl } from '@mui/material';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListSubheader from '@mui/material/ListSubheader';
import Autocomplete from '@mui/material/Autocomplete';
import FormLabel from '@mui/material/FormLabel';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import BuscarCEP from '../../../components/buscar-cep';
import ListaProdutos from '../../../components/lista-produtos';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ImageDirection from '../../../assets/img/image-direction.svg';
import Notification from '../../../components/notification';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

const CustomGroupHeader = styled(ListSubheader)(({ theme }) => ({
    backgroundColor: '#E9FAE0',
    color: '#00AB55',
    fontWeight: 700,
    fontSize: 18,
    padding: '0 10px',
    borderRadius: '0 6px 6px 0',
    width: '40px'
}));

const schema = yup.object({
    status: yup
        .string()
        .required('Status obrigatório!')
        .oneOf(
            ['Pendente', 'Entregue', 'Devolvido', 'Cancelado', 'Não Devolvido'],
            'Selecione um status válido'
        ),

    idCliente: yup
        .string()
        .required('Selecione um cliente.')
        .matches(/^[0-9a-fA-F]{24}$/, 'ID de cliente inválido.'),

    dataEntrega: yup.date()
        .nullable()
        .typeError("Data de entrega inválida!")
        .required("Data de entrega obrigatória!"),

    dataDevolucao: yup.date()
        .nullable()
        .typeError("Data de devolução inválida!")
        .min(
            yup.ref('dataEntrega'),
            'A data de devolução não pode ser anterior à data de entrega'
        )
        .required("Data de devolução obrigatória!"),

    totalParcial: yup.number()
        .typeError('O total parcial deve ser um número!')
        .min(0, 'Total parcial não pode ser negativo!'),

    desconto: yup.number()
        .typeError('O desconto deve ser um número!')
        .min(0, 'Desconto não pode ser negativo!')
        .test('desconto-menor-que-total', 'Desconto não pode ser maior que o valor parcial',
            function (value) {
                const { totalParcial } = this.parent;

                const desconto = Number(value);
                const total = Number(totalParcial);

                if (isNaN(desconto) || isNaN(total)) return true;

                return desconto <= total;
            }),

    totalGeral: yup.number()
        .typeError('O total deve ser um número!')
        .min(0, 'Total não pode ser negativo!'),

    products: yup.array()
        .min(1, 'Informe pelo menos um material.')
        .required("Informe pelo menos um material."),
});

export default function EditPedido() {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const [usarNovoEndereco, setUsarNovoEndereco] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [dadosEndereco, setDadosEndereco] = useState({} || undefined);
    const { idPedido } = useParams();
    const [pedido, setPedido] = useState(null);

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            idCliente: '',
            status: '',
            dataEntrega: null,
            dataDevolucao: null,
            products: [],
        },
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const getNomeExibido = (cliente) => {
        if (!cliente) return '';

        if (cliente.tipoPessoa === 'Fisica') {
            return cliente.nomeCliente || '';
        } else if (cliente.tipoPessoa === 'Juridica') {
            return cliente.nomeFantasia || '';
        }

        return cliente.nomeCliente || cliente.nomeFantasia || '';
    };

    useEffect(() => {
        async function fetchClients() {
            try {
                const result = await api.get('api/clients');
                const data = result.data;

                const formatted = data
                    .map((cliente) => {
                        const nome = getNomeExibido(cliente) || '';
                        const firstLetter = nome.charAt(0)?.toUpperCase();
                        return {
                            ...cliente,
                            group: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
                        };
                    })
                    .sort((a, b) => {
                        return getNomeExibido(a).localeCompare(getNomeExibido(b));
                    });

                setClients(formatted);
            } catch (err) {
                console.error("Erro ao buscar clientes:", err);
            }
        }
        fetchClients();
    }, []);

    const handleAddProduto = (produto) => {
        const newProducts = [...produtos, produto];
        setProdutos(newProducts);
    }

    const handleDeleteProduto = (id) => {
        setProdutos(prev => prev.filter(p => p.id !== id));
    };

    useEffect(() => {
        setValue('products', produtos);
    }, [produtos, setValue]);

    const handleChangeAddress = (event) => {
        setUsarNovoEndereco(event.target.value === 'novo');
    };

    const handleEnderecoFieldChange = (field, value) => {
        setDadosEndereco((prev) => ({ ...prev, [field]: value }));
    };

    const totalParcial = watch("totalParcial");
    const desconto = watch("desconto");
    const statusAtual = watch('status');

    //Faz a subtração do total geral com desconto e mostra no campo total geral
    useEffect(() => {
        const total = (Number(totalParcial) || 0) - (Number(desconto) || 0);
        setValue("totalGeral", total);
    }, [totalParcial, desconto, setValue]);

    //Soma valores dos itens adicionados e no campo total parcial
    useEffect(() => {
        const total = produtos.reduce((count, item) => count + (Number(item.valorItem) || 0), 0);
        setValue("totalParcial", total);
    }, [produtos, setValue]);

    useEffect(() => {
        async function getPedido() {
            var response = await api.get('/api/rents.details/' + idPedido);

            const pedido = response.data;
            setPedido(pedido);
            setProdutos(pedido.products || []);
            setUsarNovoEndereco(pedido.tipoEndereco === 'novo');

            const endereco = pedido.tipoEndereco === 'novo'
                ? {
                    logradouro: pedido.logradouro,
                    numero: pedido.numero,
                    bairro: pedido.bairro,
                    cidade: pedido.cidade,
                    uf: pedido.uf,
                    cep: pedido.cep,
                    complemento: pedido.complemento,
                }
                : {};

            const dataToReset = {
                idCliente: pedido.idCliente?._id || pedido.idCliente,
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
                products: pedido.products || [],
                ...endereco
            };

            reset(dataToReset);

            if (pedido.tipoEndereco === 'novo') {
                setDadosEndereco(endereco);
            } else {
                setCurrentClient(pedido.idCliente);
            }
        }

        getPedido();
    }, [idPedido, reset]);

    async function submitForm(data) {
        const payload = {
            _id: pedido._id,
            idCliente: typeof data.idCliente === 'object' ? data.idCliente._id : data.idCliente,
            numeroPedido: data.numeroPedido,
            dataPedido: data.dataPedido,
            status: data.status,
            dataEntrega: data.dataEntrega,
            dataDevolucao: data.dataDevolucao,
            totalParcial: data.totalParcial,
            desconto: data.desconto,
            totalGeral: data.totalGeral,
            observacao: data.observacao || '',
            products: produtos || [],

            tipoEndereco: usarNovoEndereco ? 'novo' : 'atual',
            numero: usarNovoEndereco ? dadosEndereco.numero : currentClient?.numero,
            logradouro: usarNovoEndereco ? dadosEndereco.logradouro : currentClient?.logradouro,
            bairro: usarNovoEndereco ? dadosEndereco.bairro : currentClient?.bairro,
            cidade: usarNovoEndereco ? dadosEndereco.cidade : currentClient?.cidade,
            uf: usarNovoEndereco ? dadosEndereco.uf : currentClient?.uf,
            cep: usarNovoEndereco ? dadosEndereco.cep : currentClient?.cep,
            complemento: usarNovoEndereco ? dadosEndereco.complemento : currentClient?.complemento || '',
        };

        try {
            const response = await api.put('/api/rents', payload);

            if (response.status === 200) {
                setNotify({
                    isOpen: true,
                    message: 'Pedido atualizado com sucesso.',
                    type: 'success'
                });

                setTimeout(() => {
                    window.location.href = '/admin/pedidos'
                }, 2500);
            } else {
                setNotify({
                    isOpen: true,
                    message: 'Erro ao atualizar pedido. Tente novamente.',
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
                        title="Editar pedido"
                        subheader={
                            <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                                <Link color="inherit" href={'/admin/pedidos'} >
                                    Pedidos
                                </Link>
                                <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar pedido</Typography>
                            </Breadcrumbs>
                        }
                        titleTypographyProps={{ align: 'left' }}
                        subheaderTypographyProps={{ align: 'left' }}
                        sx={{
                            "& .MuiCardHeader-title": {
                                fontWeight: 700,
                                color: '#212B36',
                                marginBottom: '8px'
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
                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="dataPedido"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="Data do pedido"
                                                value={field.value}
                                                disabled
                                                onChange={(date) => field.onChange(date)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
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
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                disabled
                                                label="Nº do pedido"
                                                InputProps={{ readOnly: true }}
                                                InputLabelProps={{ shrink: true }}
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
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                            >
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    label="Status"
                                                    value={field.value}
                                                    onChange={(e) => { field.onChange(e) }}
                                                >
                                                    <MenuItem value="Pendente">Pendente</MenuItem>
                                                    <MenuItem value="Entregue">Entregue</MenuItem>
                                                    <MenuItem value="Devolvido">Devolvido</MenuItem>
                                                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                                                    <MenuItem value="Não Devolvido">Não Devolvido</MenuItem>
                                                </Select>
                                                {fieldState.error && (
                                                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <Controller
                                        name="idCliente"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                disabled
                                                options={clients}
                                                groupBy={(option) => option.group}
                                                getOptionLabel={(option) => getNomeExibido(option)}
                                                isOptionEqualToValue={(option, value) => option._id === value?._id}
                                                value={clients.find((c) => c._id === field.value) || null}
                                                onChange={(event, newValue) => {
                                                    field.onChange(newValue?._id || ''); // Aqui você salva apenas o ID no form
                                                    setValue("idCliente", newValue?._id);
                                                    setCurrentClient(newValue);    // Aqui salva o objeto para seu estado
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Cliente"
                                                        placeholder="Selecione um cliente"
                                                        variant="outlined"
                                                        fullWidth
                                                        error={!!errors.idCliente}
                                                        helperText={errors.idCliente?.message}
                                                    />
                                                )}
                                                renderGroup={(params) => (
                                                    <li key={params.key}>
                                                        <CustomGroupHeader>{params.group}</CustomGroupHeader>
                                                        {params.children}
                                                    </li>
                                                )}
                                                noOptionsText="Não há resultados"
                                                loadingText="Carregando..."
                                            />
                                        )}
                                    />
                                </Grid>

                                {currentClient && (
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl fullWidth>
                                            <FormLabel>Escolha o endereço</FormLabel>
                                            <RadioGroup
                                                row
                                                value={usarNovoEndereco ? 'novo' : 'atual'}
                                                onChange={handleChangeAddress}
                                            >
                                                <FormControlLabel value="atual" control={<Radio style={{ color: '#00AB55' }} />} label="Endereço atual" />
                                                <FormControlLabel value="novo" control={<Radio style={{ color: '#00AB55' }} />} label="Novo endereço" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                )}

                                {usarNovoEndereco ? (
                                    <Grid item xs={12}>
                                        <BuscarCEP
                                            onFieldChange={handleEnderecoFieldChange}
                                            initialData={dadosEndereco}
                                        />
                                    </Grid>
                                ) : currentClient?.logradouro ? (
                                    <Grid item xs={12}>
                                        <Box sx={{ padding: 2, borderRadius: '10px', border: "2px solid #00AB55", boxShadow: "0px 2px 4px 0 hsla(0, 0.00%, 0.00%, 0.20)" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={7} md={9}>
                                                    <h2 style={{ color: '#00AB55', marginBottom: 16 }}>
                                                        Endereço de entrega
                                                    </h2>

                                                    <Box sx={{ fontSize: 18, fontWeight: 700, color: '#3B4251' }}>
                                                        <p>{currentClient?.logradouro || ''}, Nº {currentClient?.numero || ''}</p>
                                                        <p>Bairro: {currentClient?.bairro || ''} - {currentClient?.cidade || ''}</p>
                                                        <p>Complemento: {currentClient?.complemento || ''}</p>
                                                        <p>CEP: {currentClient?.cep || ''}</p>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={5} md={3}>
                                                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                        <img src={ImageDirection} height={180} alt="Mapa" />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                ) : null}

                                <Grid item xs={12} sm={12} md={12}>
                                    <ListaProdutos produtos={produtos} addProduto={handleAddProduto} deleteProduto={handleDeleteProduto} />
                                    {errors.products && (
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
                                            {errors.products.message}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Controller
                                        name="dataEntrega"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Data de entrega*"
                                                value={value}
                                                onChange={onChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            inputProps: {
                                                                ...params.inputProps,
                                                                placeholder: "DD/MM/AAAA",
                                                            },
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
                                        defaultValue={null}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Data de devolução*"
                                                value={value}
                                                onChange={onChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        disabled={statusAtual === 'Não Devolvido' || statusAtual === 'Devolvido' || statusAtual === 'Cancelado'}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            inputProps: {
                                                                ...params.inputProps,
                                                                placeholder: "DD/MM/AAAA",
                                                            },
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
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                disabled
                                                label="Total parcial"
                                                error={!!error}
                                                helperText={error?.message}
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
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                label="Desconto"
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                    max: totalParcial //Avisa q o valor não pode ser maior q o totalParcial
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <Controller
                                        name="totalGeral"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                variant="outlined"
                                                size="medium"
                                                disabled
                                                label="Total geral"
                                                error={!!error}
                                                helperText={error?.message}
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
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Observação"
                                                fullWidth
                                                multiline
                                                minRows={4}
                                                variant="outlined"
                                                size="medium"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
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