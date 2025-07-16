import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Typography, Grid, Stack, Chip, Tooltip, Box, Button, IconButton,
    Collapse, TextField, useMediaQuery, useTheme
} from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';

import { set, isValid, differenceInHours, differenceInCalendarDays } from 'date-fns';
import api from '../services/api';
import Swal from 'sweetalert2';
import Avatar from '@mui/material/Avatar';
import '../assets/css/notificacao-pedido.css';
import EmptyState from './empty-state';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function NotificacaoPedido(props) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { currentMonth, statuses, keyword } = props;
    const unidadeMedidaMap = { 'Unidade': 'unidade(s)', 'Metro': 'metro(s)' };

    const [listaPedidos, setListaPedidos] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function getDadosPedido() {
            var filter = `dataDevolucao=${currentMonth.toJSON()}`;
            filter += `&keyword=${keyword}`;
            filter += `&statuses=${statuses.join(",")}`;
            const results = await api.get(`api/rents/search?${filter}`);

            setListaPedidos(results.data);
        }

        getDadosPedido();
    }, [currentMonth, statuses, keyword]);

    const handleExpandClick = (_id) => {
        setListaPedidos(prev =>
            prev.map(item =>
                item._id === _id ? { ...item, expanded: !item.expanded } : item
            )
        );
    };

    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }

        return color;
    }

    function stringAvatar(name) {
        const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('');

        return {
            sx: {
                bgcolor: stringToColor(name),
                textTransform: 'uppercase',
            },
            children: initials
        };
    }

    const handleChangeStatus = async (_id, newStatus) => {
        const item = listaPedidos.find(item => item._id === _id);
        await api.post('api/rents/change-status', { _id, status: newStatus });
        item.status = newStatus;
        setListaPedidos([...listaPedidos]);
    };

    const handleOpenModalReturnDate = (pedido) => {
        setOpen(true);
        setPedidoSelecionado(pedido);
    };

    const handleDateDevolutionChange = (newDate) => {
        setPedidoSelecionado((prev) => ({
            ...prev,
            dataDevolucao: newDate
        }));

        //Limpar o texto de erro
        if (isValid(newDate)) {
            setErrors({});
        }
    };

    const handleDateUpdated = async () => {
        const data = pedidoSelecionado.dataDevolucao;
        const dataObj = new Date(data);

        if (!isValid(dataObj)) {
            setErrors({ dataDevolucao: 'Data inválida' });
            return;
        } else {
            setErrors({});
        }

        try {
            const response = await api.put(`/api/rents/${pedidoSelecionado._id}/data-devolucao`, {
                dataDevolucao: dataObj,
            });

            // Atualiza a lista local com a nova data
            setListaPedidos((prev) =>
                prev.map((item) =>
                    item._id === pedidoSelecionado._id
                        ? { ...item, dataDevolucao: dataObj }
                        : item
                )
            );

            setOpen(false);

            await Swal.fire({
                icon: 'success',
                title: 'Data atualizada!',
                text: 'A data de devolução foi atualizada com sucesso.',
                confirmButtonColor: '#3085D6',
            });

        } catch (error) {
            console.error('Erro ao atualizar data de devolução:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar',
                text: 'Não foi possível atualizar a data de devolução. Tente novamente.',
                confirmButtonColor: '#D33',
            });
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <main style={{ flexGrow: 1, height: '100vh' }}>
                {listaPedidos.length === 0 ? (
                    <EmptyState />
                ) : (
                    listaPedidos
                        .map((info) => {
                            var classname = "card-info";
                            var dataDevolucao = new Date(info.dataDevolucao);

                            // Zera hora para considerar só a data
                            set(dataDevolucao, {
                                hours: 0,
                                minutes: 0,
                                seconds: 0,
                                milliseconds: 0
                            });

                            var hours = differenceInHours(dataDevolucao, new Date());

                            //ANIMAÇÃO SE ATRASADO
                            if (
                                info.status === "Não Devolvido" ||
                                (info.status === "Pendente" && hours >= 0 && hours < 24)
                            ) {
                                classname += " animation"
                            }

                            //DIAS RESTANTES
                            const dataValida = info.dataDevolucao ? new Date(info.dataDevolucao) : null;

                            let diasRestantes = null;
                            let mensagem = 'Data inválida';

                            if (dataValida && !isNaN(dataValida)) {
                                diasRestantes = differenceInCalendarDays(dataValida, new Date());

                                if (diasRestantes < 0) {
                                    mensagem = `Pedido atrasado em ${Math.abs(diasRestantes)} dia(s).`;
                                } else {
                                    mensagem = `Faltam ${diasRestantes} dia(s)`;
                                }
                            }

                            // Verifica motivo de bloqueio da edição
                            let motivoBloqueio = '';

                            if (info.status === 'Devolvido') {
                                motivoBloqueio = 'Indisponível para edição, pedido já devolvido.';
                            } else if (info.status === 'Não Devolvido') {
                                motivoBloqueio = 'Indisponível para edição, pedido não devolvido.';
                            } else if (info.status === 'Cancelado') {
                                motivoBloqueio = 'Indisponível para edição, pedido cancelado.';
                            } else if (diasRestantes !== null && diasRestantes < 0) {
                                motivoBloqueio = 'Indisponível para edição, pedido atrasado';
                            } else {
                                motivoBloqueio = 'Clique para editar a data de devolução';
                            }

                            const EdicaoDataBloqueada =
                                info.status === 'Devolvido' ||
                                info.status === 'Não Devolvido' ||
                                info.status === 'Cancelado' ||
                                (diasRestantes !== null && diasRestantes < 0);

                            return (
                                <Card key={info._id} elevation={0} className={classname}>
                                    <CardHeader sx={{ padding: '0 0 16px 0px' }}
                                        avatar={
                                            <Avatar
                                                src={process.env.REACT_APP_API_URL + info.pedido_cliente?.foto || undefined}
                                                {...(!info.pedido_cliente?.foto && stringAvatar(
                                                    info.pedido_cliente?.tipoPessoa === 'Fisica'
                                                        ? info.pedido_cliente?.nomeCliente
                                                        : info.pedido_cliente?.nomeFantasia
                                                ))}
                                            />
                                        }

                                        title={
                                            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#2D2A26', textTransform: 'uppercase' }}>
                                                {info.pedido_cliente?.tipoPessoa === 'Fisica' ? info.pedido_cliente?.nomeCliente : info.pedido_cliente?.nomeFantasia}
                                            </Typography>
                                        }

                                        subheader={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Typography fontWeight={600}>
                                                    {info.logradouro}, Nº {info.numero} - Bairro: {info.bairro} - Cidade: {info.cidade} {info.complemento && ` - Complemento: ${info.complemento}`}
                                                </Typography>
                                            </Box>
                                        }>
                                    </CardHeader>

                                    <Box sx={{
                                        borderRadius: '16px',
                                        padding: 2,
                                        backgroundColor: '#FFF',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                                    }}>
                                        <CardContent sx={{ padding: '0px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                                                <Typography style={{ fontSize: 18, fontWeight: 600, marginRight: '50px' }}>
                                                    Status:
                                                </Typography>

                                                {info.status === 'Pendente' &&
                                                    <Chip sx={{
                                                        background: '#FFC107',
                                                        color: '#FFF',
                                                        fontWeight: 700,
                                                        fontSize: 16,
                                                        minWidth: 114
                                                    }}
                                                        label={info.status}
                                                    />
                                                }
                                                {info.status === 'Cancelado' &&
                                                    <Chip sx={{
                                                        background: '#E71A3B',
                                                        color: '#FFF',
                                                        fontWeight: 700,
                                                        fontSize: 16,
                                                        minWidth: 114
                                                    }}
                                                        label={info.status}
                                                    />
                                                }
                                                {info.status === 'Entregue' &&
                                                    <Chip sx={{
                                                        background: '#00AB55',
                                                        color: '#FFF',
                                                        fontWeight: 700,
                                                        fontSize: 16,
                                                        minWidth: 114
                                                    }}
                                                        label={info.status}
                                                    />
                                                }
                                                {info.status === 'Devolvido' &&
                                                    <Chip sx={{
                                                        background: '#0033C6',
                                                        color: '#FFF',
                                                        fontWeight: 700,
                                                        fontSize: 16,
                                                        minWidth: 114
                                                    }}
                                                        label={info.status}
                                                    />
                                                }
                                                {info.status === 'Não Devolvido' &&
                                                    <Chip sx={{
                                                        background: '#FF5722',
                                                        color: '#FFF',
                                                        fontWeight: 700,
                                                        fontSize: 16,
                                                        minWidth: 114
                                                    }}
                                                        label={info.status}
                                                    />
                                                }
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
                                                <Typography style={{ fontSize: 18, fontWeight: 600, marginRight: '10px' }}>
                                                    Contato(s):
                                                </Typography>

                                                {info?.pedido_cliente?.contacts?.length > 0 &&
                                                    info.pedido_cliente.contacts.map((item) => (
                                                        <Stack key={item.id}>
                                                            <Chip
                                                                style={{ fontFamily: 'Nunito', fontSize: 15, padding: '0px 4px' }}
                                                                icon={item.tipoTelefone === "Celular" ? <PhoneAndroidIcon /> : <PhoneIcon />}
                                                                label={item.numero}
                                                            />
                                                        </Stack>
                                                    ))
                                                }
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ padding: '0' }} disableSpacing>

                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '8px',
                                                }}>

                                                <Typography style={{ fontSize: 18, fontWeight: 600, marginRight: 10 }}>Devolução:</Typography>

                                                <Tooltip title={motivoBloqueio}>
                                                    <span>
                                                        <Button
                                                            onClick={() => handleOpenModalReturnDate(info)}
                                                            disabled={EdicaoDataBloqueada}
                                                            variant='outlined'
                                                            startIcon={<EditCalendarRoundedIcon style={{ color: '#E71A3B', marginRight: '4px' }} />}
                                                            sx={{
                                                                borderColor: '#E71A3B !important',
                                                                borderRadius: '16px',
                                                                height: '32px',

                                                                '&:hover': {
                                                                    borderColor: '#C21631',
                                                                    backgroundColor: 'rgba(231, 26, 59, 0.1)',
                                                                },

                                                                '& .MuiTouchRipple-root': {
                                                                    color: '#C21631',
                                                                }
                                                            }}>

                                                            <Typography style={{ color: '#E71A3B', fontWeight: 700 }}>
                                                                {new Date(info.dataDevolucao).toLocaleDateString('pt-br')}
                                                            </Typography>
                                                        </Button>
                                                    </span>
                                                </Tooltip>

                                                {info.status !== 'Cancelado' && info.status !== 'Devolvido' &&
                                                    <Typography fontSize={14} fontWeight={600} color={
                                                        diasRestantes !== null && !isNaN(diasRestantes)
                                                            ? diasRestantes < 0
                                                                ? '#E71A3B'
                                                                : '#666'
                                                            : '#999'
                                                    }>
                                                        {mensagem}
                                                    </Typography>
                                                }
                                            </Box>

                                            <Dialog sx={{ marginTop: '-150px' }} open={open && info.status !== 'Devolvido'} onClose={() => setOpen(false)}>
                                                <DialogContent>
                                                    <DialogContentText style={{ display: 'flex', alignItems: 'center', fontWeight: 700, gap: '8px', marginBottom: "24px" }}>
                                                        <EditCalendarRoundedIcon style={{ color: '#00AB55' }} />
                                                        Informe a nova data de devolução do pedido!
                                                    </DialogContentText>

                                                    {pedidoSelecionado && (
                                                        <DatePicker
                                                            label='Data de devolução'
                                                            value={pedidoSelecionado.dataDevolucao}
                                                            onChange={handleDateDevolutionChange}
                                                            size='medium'
                                                            inputVariant='outlined'
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    fullWidth
                                                                    error={!!errors.dataDevolucao}
                                                                    helperText={errors.dataDevolucao || ''}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </DialogContent>

                                                <DialogActions sx={{ padding: '0px 24px 12px 24px' }}>
                                                    <Button variant='' onClick={() => { setOpen(false); setErrors({}) }}>Cancelar</Button>
                                                    <Button onClick={handleDateUpdated}>Salvar</Button>
                                                </DialogActions>
                                            </Dialog>

                                            <ExpandMore expand={info.expanded} onClick={() => handleExpandClick(info._id)}>
                                                <Tooltip title='Ver produtos'>
                                                    <ExpandMoreIcon />
                                                </Tooltip>
                                            </ExpandMore>
                                        </CardActions>
                                    </Box>

                                    <Collapse in={info.expanded} timeout={'auto'} unmountOnExit>
                                        <CardContent sx={{
                                            padding: '16px 0',

                                            '&:last-child': {
                                                paddingBottom: 0,
                                            },
                                        }}>
                                            <Box sx={{
                                                borderRadius: '16px',
                                                padding: 2,
                                                backgroundColor: '#FFF',
                                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                                            }}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Box
                                                            display='flex'
                                                            flexDirection={isSmallScreen ? 'column-reverse' : 'row'}
                                                            justifyContent="space-between"
                                                            flexWrap="wrap"
                                                            alignItems='center'
                                                            gap={2}
                                                            mb={2}
                                                        >
                                                            <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                                                                Produto(s)
                                                            </Typography>

                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Typography style={{ fontSize: 18, fontWeight: 600, fontStyle: 'italic' }}>
                                                                    Pedido Nº: <strong style={{ fontSize: 20, fontWeight: 800 }}>#{info.numeroPedido}</strong>
                                                                </Typography>
                                                                <Typography style={{ fontSize: 18, fontWeight: 600, fontStyle: 'italic' }}>
                                                                    Data do pedido: <strong style={{ fontSize: 20, fontWeight: 800 }}>{new Date(info.dataPedido).toLocaleDateString('pt-br')}</strong>
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Box sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            flexWrap: "wrap",
                                                            gap: '16px',
                                                            marginBottom: 1,
                                                        }} >
                                                            {info.products.map((item) => (
                                                                <Box
                                                                    key={item._id}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 1.5,
                                                                        padding: 1.5,
                                                                        borderRadius: 2,
                                                                        bgcolor: "#F0F0F0",
                                                                        minWidth: 200,
                                                                    }}
                                                                >
                                                                    <VerifiedRoundedIcon sx={{ fontSize: 42, color: '#5E5E5E' }} />

                                                                    <Box>
                                                                        <Typography fontWeight={700}>{item.nomeMaterial}</Typography>
                                                                        <Typography fontSize={15}>
                                                                            {item.qtde + " " + unidadeMedidaMap[item.unidadeMedida]}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Box sx={{ bgcolor: '#F0F0F0', borderRadius: 2, padding: 1.5 }} >
                                                            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                                                                Observação: {info.observacao || 'Não há observação.'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 1 }}>
                                                            {info.status === "Pendente" &&
                                                                <Button
                                                                    onClick={() => handleChangeStatus(info._id, "Entregue")}
                                                                    variant='outlined'
                                                                    size='large'
                                                                    title="Entregar"
                                                                    startIcon={<CheckCircleRoundedIcon />}

                                                                    sx={{
                                                                        backgroundColor: '#1C7E2E !important',
                                                                        border: '#1C7E2E !important',
                                                                        color: '#FFF',
                                                                        minWidth: 150
                                                                    }}>
                                                                    Entregue
                                                                </Button>
                                                            }

                                                            {info.status === "Pendente" &&
                                                                <Button
                                                                    onClick={() => handleChangeStatus(info._id, "Cancelado")}
                                                                    variant='outlined'
                                                                    size='large'
                                                                    title="Cancelado"
                                                                    startIcon={<CancelRoundedIcon />}

                                                                    sx={{
                                                                        backgroundColor: '#E71A3B !important',
                                                                        border: '#E71A3B !important',
                                                                        color: '#FFF',
                                                                        minWidth: 150
                                                                    }}>
                                                                    Cancelar
                                                                </Button>
                                                            }

                                                            {info.status === "Entregue" &&
                                                                <Button
                                                                    onClick={() => handleChangeStatus(info._id, "Devolvido")}
                                                                    variant='outlined'
                                                                    size='large'
                                                                    title="Devolvido"
                                                                    startIcon={<ReplayCircleFilledRoundedIcon />}

                                                                    sx={{
                                                                        backgroundColor: '#0033C6 !important',
                                                                        border: '#0033C6 !important',
                                                                        color: '#FFF',
                                                                        minWidth: 150
                                                                    }}>
                                                                    Devolvido
                                                                </Button>
                                                            }
                                                            {info.status === "Não Devolvido" &&
                                                                <Button
                                                                    onClick={() => handleChangeStatus(info._id, "Devolvido")}
                                                                    variant='outlined'
                                                                    size='large'
                                                                    title="Devolvido"
                                                                    startIcon={<ReplayCircleFilledRoundedIcon />}

                                                                    sx={{
                                                                        backgroundColor: '#0033C6 !important',
                                                                        border: '#0033C6 !important',
                                                                        color: '#FFF',
                                                                        minWidth: 150
                                                                    }}>
                                                                    Devolvido
                                                                </Button>
                                                            }
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            )
                        })
                )}
            </main>
        </div >
    );
}