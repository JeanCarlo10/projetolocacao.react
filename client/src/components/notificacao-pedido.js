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

import { getCurrentMonth } from '../helpers/dateFilter';

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

export default function NotificacaoPedido() {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);
    const [listaPedidos, setListaPedidos] = useState([]);
    const [filteredList, setFilteredList] = useState(listaPedidos);
    const [mesAtual, setMesAtual] = useState(getCurrentMonth());
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [filteredStatus, setFilteredStatus] = useState([
        {
            id: 1,
            checked: false,
            label: 'Pendente'
        },
        {
            id: 2,
            checked: false,
            label: 'Entregue'
        },
        {
            id: 3,
            checked: false,
            label: 'Cancelado'
        },
        {
            id: 4,
            checked: false,
            label: 'Devolvido'
        },
    ]);
    // const filterListByMonth = (list, date) => {
    //     const str = date || '';

    //     let newList = [listaPedidos];
    //     let [year, month] = str.split('-');

    //     for (let i in list) {
    //         if (
    //             list[i].str.getFullYear() === parseInt(year) &&
    //             (list[i].str.getMonth() + 1) === parseInt(month)
    //         ) {
    //             newList.push(list[i]);
    //         }
    //     }

    //     return newList;
    // }

    useEffect(() => {
        // setFilteredList(filterListByMonth(listaPedidos, mesAtual));
    }, [listaPedidos, mesAtual]);

    useEffect(() => {
        async function getDadosPedido() {

            const results = await api.get('http://localhost:5000/api/rents');
            setListaPedidos(results.data);
        }

        getDadosPedido();
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
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

    return (
        <>
            {listaPedidos.map((info) => (
                info.status == 'Pendente' ?
                    <Card className="card-info animation">
                        <CardHeader key={info._id} 
                            avatar={
                                <Avatar {...stringAvatar('Janete Nunes')} />
                            }
                            action={
                                <div>
                                    <Tooltip title="Entregar">
                                        <IconButton style={{ color: '#1c7e2e' }} >
                                            <CheckCircleRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancelar">
                                        <IconButton>
                                            <CancelRoundedIcon style={{ color: '#e71a3b' }} fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Devolvido">
                                        <IconButton>
                                            <ReplayCircleFilledRoundedIcon style={{ color: '#0033c6' }} fontSize='large' />
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
                                    Endereço de entrega: Avenida Nacional, 482 - Três bandeiras
                                    {/* {info.logradouro}, {info.numero} - {info.bairro} */}
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
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                            ><ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout={'auto'} unmountOnExit>
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
                                                <TableBody>
                                                    <StyledTableRow>
                                                        <StyledTableCell align="left">{info.observacao}</StyledTableCell>
                                                        <StyledTableCell align="center">{info.observacao}</StyledTableCell>
                                                    </StyledTableRow>
                                                    <StyledTableRow>
                                                        <StyledTableCell align="left">{info.observacao}</StyledTableCell>
                                                        <StyledTableCell align="center">{info.observacao}</StyledTableCell>
                                                    </StyledTableRow>
                                                    <StyledTableRow>
                                                        <StyledTableCell align="left">{info.observacao}</StyledTableCell>
                                                        <StyledTableCell align="center">{info.observacao}</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </CardContent>
                        </Collapse>
                    </Card> : <Card className="card-info">
                        <CardHeader key={info._id}
                            avatar={
                                <Avatar {...stringAvatar('Janete Nunes')} />
                            }
                            action={
                                <div>
                                    <Tooltip title="Entregar">
                                        <IconButton style={{ color: '#1c7e2e' }} >
                                            <CheckCircleRoundedIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancelar">
                                        <IconButton>
                                            <CancelRoundedIcon style={{ color: '#e71a3b' }} fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Devolvido">
                                        <IconButton>
                                            <ReplayCircleFilledRoundedIcon style={{ color: '#0033c6' }} fontSize='large' />
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
                                <div className='subTitleAddress'>
                                    Endereço de entrega: Avenida Nacional, 482 - Três bandeiras
                                    {/* {info.logradouro}, {info.numero} - {info.bairro} */}
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
                                <p>Devolução</p>
                                <div>
                                    <IconButton>
                                        <EventBusyRoundedIcon style={{ color: '#e71a3b' }} />
                                    </IconButton>
                                    {new Date(info.dataDevolucao).toLocaleDateString('pt-br')}
                                </div>
                            </div>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                            ><ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                            <CardContent>
                                <Typography paragraph>MATERIAIS</Typography>
                                <Typography paragraph>
                                    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                    minutes.
                                </Typography>
                                <Typography paragraph>
                                    Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                    without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                    medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                    again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                    minutes more. (Discard any mussels that don’t open.)
                                </Typography>
                                <Typography>
                                    Set aside off of the heat to let rest for 10 minutes, and then serve.
                                </Typography>
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
