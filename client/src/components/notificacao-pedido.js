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
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#374151'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function NotificacaoPedido(props) {
    const { currentMonth } = props;
    const classes = useStyles();

    //Dados cliente
    const [selectClients, setSelectClients] = useState([]);
    const [clientId, setClientId] = useState('');
    const [currentClient, setCurrentClient] = useState({});

    const [expanded, setExpanded] = useState(false);
    const [listaPedidos, setListaPedidos] = useState([]);
    const [listaMateriais, setListaMateriais] = useState([]);
    const [status, setStatus] = useState();

    useEffect(() => {
        async function getDadosPedido() {
            // await api.get(`http://localhost:5000/api/rents/status`);
            const results = await api.get(`http://localhost:5000/api/rents/search?dataDevolucao=${currentMonth.toJSON()}`);
            setListaPedidos(results.data);
        }

        getDadosPedido();
    }, [currentMonth]);

    useEffect(() => {
        async function getDadosCliente() {

            const results = await api.get('http://localhost:5000/api/clients');
            setSelectClients(results.data);
        }

        getDadosCliente();
    }, []);

    function handleSelectClients(e) {
        const clientId = e.target.value;
        setCurrentClient(selectClients.find(e => e._id == clientId));
        setClientId(clientId);
    }

    const handleExpandClick = (_id) => {
        const item = listaPedidos.find(item => item._id == _id);
        item.expanded = !item.expanded;
        setListaPedidos([...listaPedidos]);
        // setExpanded(!expanded)
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
        await api.post(`http://localhost:5000/api/rents/change-status`, {_id, status});
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    const handleChangeStatusCancelado = async (_id, status) => {
        const item = listaPedidos.find((item) => item._id == _id);
        await api.post(`http://localhost:5000/api/rents/change-status`, {_id, status});
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    const handleChangeStatusDevolvido = async (_id, status) => {
        const item = listaPedidos.find((item) => item._id == _id);
        await api.post(`http://localhost:5000/api/rents/change-status`, {_id, status});
        item.status = status;
        setListaPedidos([...listaPedidos]);
    }

    return (
        <>
            {listaPedidos.map((info) => (
                <Card className="card-info animation">
                    <CardHeader key={info._id}
                        avatar={
                            <Avatar {...stringAvatar('Janete Nunes')} />
                        }
                        action={
                            <div>
                                <Tooltip title="Entregar">
                                    <IconButton style={{ color: '#1c7e2e' }} onClick={() => handleChangeStatusEntregue(info._id, "Entregue")}>
                                        <CheckCircleRoundedIcon fontSize='large' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                    <IconButton style={{ color: '#e71a3b' }} onClick={() => handleChangeStatusCancelado(info._id, "Cancelado")}>
                                        <CancelRoundedIcon fontSize='large' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Devolvido">
                                    <IconButton style={{ color: '#0033c6' }} onClick={() => handleChangeStatusDevolvido(info._id, "Devolvido")}>
                                        <ReplayCircleFilledRoundedIcon  fontSize='large' />
                                    </IconButton>
                                </Tooltip>

                            </div>
                        }
                        title={
                            <div className='title'>
                                {info.nomeCliente}
                            </div>
                        }
                        subheader={
                            <div className="subTitleAddress">
                                {info.logradouro}, Nº {info.numero} - Bairro: {info.bairro}
                                {/* Endereço de entrega: Avenida Nacional, 482 - Três bandeiras */}
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
                    </CardContent>
                    <CardActions disableSpacing>
                        <div className='info'>
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
                                <p style={{ marginBottom: 10 }}>
                                    Data do pedido: {new Date(info.dataPedido).toLocaleDateString('pt-br')}
                                </p>
                            </div>

                            <div className='info-content'>
                                <p>Produto(s)</p>
                                <div>
                                    <TableContainer>
                                        <Table sx={{ minWidth: 700 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left">Material</StyledTableCell>
                                                    <StyledTableCell align="center">Qtde/Metro</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            {info.products.map((item) => (
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <StyledTableCell align="left">{item.nomeMaterial}</StyledTableCell>
                                                        <StyledTableCell align="center">{item.qtde}</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            ))}
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    cardInfo: {
        color: '#858546'
    },
}));
