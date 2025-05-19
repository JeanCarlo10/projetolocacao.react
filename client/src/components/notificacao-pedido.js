import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayCircleFilledRoundedIcon from '@mui/icons-material/ReplayCircleFilledRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { set, differenceInHours } from 'date-fns';
import api from '../services/api';
import Avatar from '@mui/material/Avatar';
import '../assets/css/notificacao-pedido.css';
import IconCalendar from '../assets/img/calendar-green.svg';
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Nunito',
    marginTop: '10px',

    [`&.${tableCellClasses.head}`]: {
        fontWeight: 700,
        color: '#2d2a26',
        paddingTop: 6,
        paddingBottom: 6,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#3B4251',
        fontWeight: 700
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StyledTableCellLate = styled(TableCell)(({ theme }) => ({
    fontFamily: 'Nunito',
    borderBottom: '1px solid #ad0000',
    marginTop: '10px',

    [`&.${tableCellClasses.head}`]: {
        fontWeight: 700,
        color: '#FFF',
        backgroundColor: '#BD1E1E',
        paddingTop: 6,
        paddingBottom: 6,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#6a1100',
        fontWeight: 700,
    },
}));

const StyledTableRowLate = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#fd5959',
    },
    '&:nth-of-type(even)': {
        backgroundColor: "#f9d9dc",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function NotificacaoPedido(props) {
    const { currentMonth, statuses, keyword } = props;
    const unidadeMedidaMap = { 'Unidade': 'unidade(s)', 'Metro': 'metro(s)' };

    const [listaPedidos, setListaPedidos] = useState([]);
    const [observacaoUpdated, setObservacaoUpdated] = useState();
    const [dataDevolucao, setDataDevolucao] = useState(null);
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

        /* eslint-disable no-bitwise */
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDateDevolutionChange = (date, id) => {
        setListaPedidos(prev =>
            prev.map(item =>
                item._id === id ? { ...item, dataDevolucao: date } : item
            )
        );
    }

    const handleDateUpdated = () => {

    }

    return (
        <RootContainer>
            {listaPedidos.length === 0 ? (
                <EmptyState />
            ) : (
                listaPedidos
                    .map((info) => {
                        var classname = "card-info";
                        var dataDevolucao = new Date(info.dataDevolucao);
                        set(dataDevolucao, {
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                            milliseconds: 0
                        });

                        var hours = differenceInHours(dataDevolucao, new Date());

                        if (info.status === "Não Devolvido" || (hours < 24 && info.status === "Pendente" || info.status === "Entregue")) {
                            classname += " animation"
                        }

                        return (
                            <Card key={info._id} elevation={0} className={classname}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            {...stringAvatar(`${info.pedido_cliente?.tipoPessoa === 'Fisica' ?
                                                info.pedido_cliente?.nomeCliente : info.pedido_cliente?.nomeFantasia}`
                                            )}
                                        />
                                    }
                                    action={
                                        <div>
                                            {info.status === "Pendente" &&
                                                <Tooltip title="Entregar">
                                                    <IconButton style={{ color: '#1c7e2e' }} onClick={() => handleChangeStatus(info._id, "Entregue")}>
                                                        <CheckCircleRoundedIcon fontSize='large' />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {info.status === "Pendente" &&
                                                <Tooltip title="Cancelar">
                                                    <IconButton style={{ color: '#e71a3b' }} onClick={() => handleChangeStatus(info._id, "Cancelado")}>
                                                        <CancelRoundedIcon fontSize='large' />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {info.status === "Entregue" &&
                                                <Tooltip title="Devolvido">
                                                    <IconButton style={{ color: '#0033c6' }} onClick={() => handleChangeStatus(info._id, "Devolvido")}>
                                                        <ReplayCircleFilledRoundedIcon fontSize='large' />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {info.status === "Não Devolvido" &&
                                                <Tooltip title="Devolvido">
                                                    <IconButton style={{ color: '#0033c6' }} onClick={() => handleChangeStatus(info._id, "Devolvido")}>
                                                        <ReplayCircleFilledRoundedIcon fontSize='large' />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </div>
                                    }
                                    title={
                                        <div className="containerTitle">
                                            <div className="title">
                                                {info.pedido_cliente?.tipoPessoa === 'Fisica' ? info.pedido_cliente?.nomeCliente : info.pedido_cliente?.nomeFantasia}
                                            </div>

                                            {info?.pedido_cliente?.contacts?.length > 0 &&
                                                info.pedido_cliente.contacts.map((item, index) => (
                                                    <Stack key={item.id} mb={0.5}>
                                                        <Chip
                                                            style={{ fontFamily: 'Nunito' }}
                                                            icon={item.tipoTelefone === "Celular" ? <PhoneAndroidIcon /> : <PhoneIcon />}
                                                            label={item.numero}
                                                        />
                                                    </Stack>
                                                ))
                                            }
                                        </div>
                                    }
                                    subheader={
                                        <div className='subTitle-Address'>
                                            {info.logradouro}, Nº {info.numero} - Bairro: {info.bairro} - {info.complemento}
                                        </div>
                                    }>
                                </CardHeader>
                                <CardContent>
                                    {info.status === 'Pendente' &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700 }}>Status:</span>
                                            <Chip sx={{
                                                background: '#FFC107',
                                                color: '#FFF',
                                                fontWeight: 700,
                                                fontSize: 16,
                                                minWidth: 114
                                            }}
                                                label={info.status}
                                            />
                                        </Box>
                                    }
                                    {info.status === 'Cancelado' &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700 }}>Status:</span>
                                            <Chip sx={{
                                                background: '#E71A3B',
                                                color: '#FFF',
                                                fontWeight: 700,
                                                fontSize: 16,
                                                minWidth: 114
                                            }}
                                                label={info.status}
                                            />
                                        </Box>
                                    }
                                    {info.status === 'Entregue' &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700 }}>Status:</span>
                                            <Chip sx={{
                                                background: '#00AB55',
                                                color: '#FFF',
                                                fontWeight: 700,
                                                fontSize: 16,
                                                minWidth: 114
                                            }}
                                                label={info.status}
                                            />
                                        </Box>
                                    }
                                    {info.status === 'Devolvido' &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700 }}>Status:</span>
                                            <Chip sx={{
                                                background: '#0033C6',
                                                color: '#FFF',
                                                fontWeight: 700,
                                                fontSize: 16,
                                                minWidth: 114
                                            }}
                                                label={info.status}
                                            />
                                        </Box>
                                    }
                                    {info.status === 'Não Devolvido' &&
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700 }}>Status:</span>
                                            <Chip sx={{
                                                background: '#FF5722',
                                                color: '#FFF',
                                                fontWeight: 700,
                                                fontSize: 16,
                                                minWidth: 114
                                            }}
                                                label={info.status}
                                            />
                                        </Box>
                                    }
                                </CardContent>
                                <CardActions disableSpacing>
                                    <div className='info-data-devolucao'>
                                        <p style={{ marginLeft: 8 }}>Data de devolução</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClickOpen}>
                                            <IconButton>
                                                <EventBusyRoundedIcon style={{ color: '#e71a3b' }} />
                                            </IconButton>
                                            <div style={{ color: '#e71a3b', fontWeight: 700 }}>
                                                {new Date(info.dataDevolucao).toLocaleDateString('pt-br')}
                                            </div>
                                        </div>
                                        <Dialog open={open} onClose={handleClose}>
                                            {/* <DialogTitle>Alteração Data de devolução</DialogTitle> */}
                                            <DialogContent>
                                                <DialogContentText style={{ fontWeight: 700, paddingBottom: "20px", display: "flex", alignItems: "center" }}>
                                                    <img src={IconCalendar} width={35} height={35} />
                                                    Por favor, informe a nova data de devolução do pedido!
                                                </DialogContentText>
                                                <DatePicker
                                                    label='Data devolução'
                                                    size='small'
                                                    autoOk
                                                    fullWidth
                                                    inputVariant='outlined'
                                                    format="dd/MM/yyyy"
                                                    cancelLabel="CANCELAR"
                                                    value={info.dataDevolucao}
                                                    onChange={(date) => handleDateDevolutionChange(date, info._id)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancelar</Button>
                                                <Button onClick={handleDateUpdated}>Salvar</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>

                                    <ExpandMore
                                        expand={info.expanded}
                                        onClick={() => handleExpandClick(info._id)}
                                    ><ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={info.expanded} timeout={'auto'} unmountOnExit>
                                    <CardContent>
                                        {info.status === "Não Devolvido" || (hours < 24 && info.status === "Pendente" || info.status === "Entregue") ?
                                            <>
                                                <div className='info-atrasado'>
                                                    <span>
                                                        Nº Pedido: {info.numeroPedido}
                                                    </span>
                                                    <span>
                                                        Data do pedido: {new Date(info.dataPedido).toLocaleDateString('pt-br')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className='titulo-atrasado'>Lista de produto(s)</span>
                                                    <TableContainer>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <StyledTableCellLate align="left">Material</StyledTableCellLate>
                                                                    <StyledTableCellLate align="center">Quantidade</StyledTableCellLate>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {info.products.map((item) => (
                                                                    <StyledTableRowLate key={item._id}>
                                                                        <StyledTableCellLate align="left">{item.nomeMaterial}</StyledTableCellLate>
                                                                        <StyledTableCellLate align="center">{item.qtde + " " + unidadeMedidaMap[(item.unidadeMedida)]} </StyledTableCellLate>
                                                                    </StyledTableRowLate>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </> :
                                            <>
                                                <div className='info-default'>
                                                    <span>
                                                        Nº Pedido: {info.numeroPedido}
                                                    </span>
                                                    <span>
                                                        Data do pedido: {new Date(info.dataPedido).toLocaleDateString('pt-br')}
                                                    </span>
                                                </div>

                                                <label className='titulo-default'>Lista de produto(s)</label>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <StyledTableCell align="left">Material</StyledTableCell>
                                                                <StyledTableCell align="center">Quantidade</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {info.products.map((item) => (
                                                                <StyledTableRow key={item._id}>
                                                                    <StyledTableCell align="left">{item.nomeMaterial}</StyledTableCell>
                                                                    <StyledTableCell align="center">{item.qtde + " " + unidadeMedidaMap[(item.unidadeMedida)]} </StyledTableCell>
                                                                </StyledTableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        }

                                        <TextField style={{ marginTop: '15px' }}
                                            fullWidth
                                            disabled
                                            variant="outlined"
                                            label="Observação"
                                            multiline
                                            rows={4}
                                            value={info.observacao}
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>
                        )
                    })
            )}
        </RootContainer>
    );
}

export const RootContainer = styled('div')({
    width: '100%',
});

// export const InputStyle = {
//     '& label.Mui-focused': {
//         color: '#00AB55',
//     },
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             borderColor: '#dce0e4',
//         },
//         '&:hover fieldset': {
//             borderColor: '#3d3d3d',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: '#00AB55',
//         },
//     },
// };

// export const InputLateStyle = {
//     '& label.Mui-focused': {
//         color: '#6a1100',
//     },
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             borderColor: '#BD1E1E',
//         },
//         '&:hover fieldset': {
//             borderColor: '#3d3d3d',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: '#00AB55',
//         },
//     },
// };

// export const TableDefaultStyle = styled(Table)(({ theme }) => ({
//     minWidth: 700,
//     borderRadius: 5,
//     background: '#F3F4F6',

//     '& .MuiTableHead-root': {
//         fontFamily: 'Nunito, sans-serif',
//     },
// }));


// export const TableAtrasadoStyle = styled(Table)(({ theme }) => ({
//     minWidth: 700,
//     borderRadius: 5,

//     '& .MuiTableHead-root': {
//         fontFamily: 'Nunito, sans-serif',
//     },
// }));