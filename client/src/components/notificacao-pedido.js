import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
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

import { set, differenceInHours } from 'date-fns';
import api from '../services/api';
import Avatar from '@mui/material/Avatar';
import '../assets/css/notificacao-pedido.css';

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
    fontFamily: 'Public Sans',
    [`&.${tableCellClasses.head}`]: {
        fontWeight: 700,
        color: '#2d2a26',
        paddingTop: 6,
        paddingBottom: 6,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#374151',
        fontWeight: 500
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

export default function NotificacaoPedido(props) {
    const { currentMonth, statuses, keyword } = props;
    const classes = useStyles();

    const [listaPedidos, setListaPedidos] = useState([]);
    const [dataDevolucao, setDataDevolucao] = useState();

    useEffect(() => {
        async function getDadosPedido() {
            var filter = `dataDevolucao=${currentMonth.toJSON()}`;
            filter += `&keyword=${keyword}`;
            filter += `&statuses=${statuses.join(",")}`;
            const results = await api.get(`http://localhost:5000/api/rents/search?${filter}`);
            setListaPedidos(results.data);
        }

        getDadosPedido();
    }, [currentMonth, statuses, keyword]);

    const handleExpandClick = (_id) => {
        const item = listaPedidos.find(item => item._id == _id);
        item.expanded = !item.expanded;
        setListaPedidos([...listaPedidos]);
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
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const handleChangeStatusEntregue = async (_id, status) => {
        const item = listaPedidos.find((item) => item._id == _id);
        await api.post('http://localhost:5000/api/rents/change-status', { _id, status });
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    const handleChangeStatusCancelado = async (_id, status) => {
        const item = listaPedidos.find((item) => item._id == _id);
        await api.post('http://localhost:5000/api/rents/change-status', { _id, status });
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    const handleChangeStatusDevolvido = async (_id, status) => {
        const item = listaPedidos.find((item) => item._id == _id);
        await api.post('http://localhost:5000/api/rents/change-status', { _id, status });
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    return (
        <>
            {listaPedidos.map((info) => {
                var classname = "card-info";
                var dataDevolucao = new Date(info.dataDevolucao);
                set(dataDevolucao, {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0
                });

                var hours = differenceInHours(dataDevolucao, new Date());

                if (info.status == "Não Devolvido" || (hours < 24 && info.status == "Pendente") ) {
                    classname += " animation"
                }

                return (<Card elevation={0} className={classname}>
                    <CardHeader key={info._id}
                        avatar={
                            <Avatar {...stringAvatar(`${info.nomeCliente}`)} />
                        }
                        action={
                            <div>
                                {info.status == "Pendente" &&
                                    <Tooltip title="Entregar">
                                        <IconButton style={{ color: '#1c7e2e' }} onClick={() => handleChangeStatusEntregue(info._id, "Entregue")}>
                                            <CheckCircleRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {info.status == "Pendente" &&
                                    <Tooltip title="Cancelar">
                                        <IconButton style={{ color: '#e71a3b' }} onClick={() => handleChangeStatusCancelado(info._id, "Cancelado")}>
                                            <CancelRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {info.status == "Entregue" && 
                                    <Tooltip title="Devolvido">
                                        <IconButton style={{ color: '#0033c6' }} onClick={() => handleChangeStatusDevolvido(info._id, "Devolvido")}>
                                            <ReplayCircleFilledRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                }
                                {info.status == "Não Devolvido" &&
                                    <Tooltip title="Devolvido">
                                        <IconButton style={{ color: '#0033c6' }} onClick={() => handleChangeStatusDevolvido(info._id, "Devolvido")}>
                                            <ReplayCircleFilledRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        }
                        title={
                            <div className='title'>
                                {info.nomeCliente}
                            </div>

                            // {info.contacts.map((item) => (
                            //     <Stack direction="row" mb={0.5}>
                            //       <Chip icon={item.tipoTelefone == "Celular" ? <PhoneAndroidIcon /> : <PhoneIcon />} label={item.numero } />
                            //     </Stack>                              
                            //   ))}
                        }
                        subheader={
                            <div className="subTitleAddress">
                                {info.logradouro}, Nº {info.numero} - {info.bairro} - {info.complemento}
                            </div>
                        }>
                    </CardHeader>
                    <CardContent>
                        {info.status == 'Pendente' &&
                            <div className='status-pendente'>
                                Status: {info.status}
                            </div>
                        }
                        {info.status == 'Cancelado' &&
                            <div className='status-cancelado'>
                                Status: {info.status}
                            </div>
                        }
                        {info.status == 'Entregue' &&
                            <div className='status-entregue'>
                                Status: {info.status}
                            </div>
                        }
                        {info.status == 'Devolvido' &&
                            <div className='status-devolvido'>
                                Status: {info.status}
                            </div>
                        }
                        {info.status == 'Não Devolvido' &&
                            <div className='status-cancelado'>
                                Status: {info.status}
                            </div>
                        }
                    </CardContent>
                    <CardActions disableSpacing>
                        <div className='info-data-devolucao'>
                            <p style={{ marginLeft: 8 }}>Data de devolução</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton>
                                    <EventBusyRoundedIcon style={{ color: '#e71a3b' }} />
                                </IconButton>
                                <div style={{ color: '#e71a3b', fontWeight: 'bold' }}>
                                    {new Date(info.dataDevolucao).toLocaleDateString('pt-br')}
                                </div>
                            </div>
                        </div>

                        <ExpandMore
                            expand={info.expanded}
                            onClick={() => handleExpandClick(info._id)}
                        ><ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={info.expanded} timeout={'auto'} unmountOnExit>
                        <CardContent>
                            <div className='info'>
                                <span>
                                    Nº Pedido: {info.numeroPedido}
                                </span>
                                <span>
                                    Data do pedido: {new Date(info.dataPedido).toLocaleDateString('pt-br')}
                                </span>
                            </div>

                            <div className='info-content'>
                                <p>Produto(s)</p>
                                <div>
                                    <TableContainer>
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left">Material</StyledTableCell>
                                                    <StyledTableCell align="center">Qtde/Metro</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {info.products.map((item) => (
                                                    <StyledTableRow key={item._id}>
                                                        <StyledTableCell align="left">{item.nomeMaterial}</StyledTableCell>
                                                        <StyledTableCell align="center">{item.qtde}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>);
            })}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    table: {
        '&:MuiTableHead': {
            fontFamily: 'Public Sans',
        },
        minWidth: 700,
        borderRadius: 5,
        background: '#F3F4F6'
    },
    cardInfo: {
        color: '#858546'
    },
}));
