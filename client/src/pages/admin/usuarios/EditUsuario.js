import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CachedIcon from '@material-ui/icons/Cached';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';
import { useParams, useHistory } from 'react-router-dom';

export default function EditUsuario() {
    const classes = useStyles();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');

    const { idUsuario } = useParams();

    useEffect(() => {
        async function getUsuario() {
            var response = await api.get('/api/users.details/' + idUsuario);

            setNome(response.data.nmUsuario);
            setEmail(response.data.dsEmail);
            setSenha(response.data.senha);
            setTipo(response.data.flUsuario);
        }

        getUsuario();
    }, [])

    /*Volta tela anterior */
    let history = useHistory();
    function goBack() {
        history.goBack('/admin/usuarios')
    }


    async function handleSubmit() {
        const data = {
            nmUsuario: nome,
            dsEmail: email,
            flUsuario: tipo,
            senha: senha,
            _id: idUsuario
        }

        if (nome != '' && email != '' && tipo != '' && senha != '') {
            const response = await api.put('/api/users', data);

            if (response.status == 200) {
                window.location.href = '/admin/usuarios'
            } else {
                alert('Erro ao atualizar o usuário');
            }
        } else {
            alert('Campos obrigatórios');
        }
    }

    return (
        <div className={classes.root}>
            <MenuAdmin title={'Editar usuário'}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Accordion defaultExpanded>
                        <AccordionActions>
                            <Typography>
                                Editar usuário
                            </Typography>
                        </AccordionActions>

                        <Divider />

                        <AccordionDetails className={classes.details}>
                            <Grid container spacing={3}>
                                <Grid item sm={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                required
                                                id="nome"
                                                name="nome"
                                                label="Nome usuário"
                                                fullWidth
                                                autoComplete="nome"
                                                value={nome}
                                                onChange={e => setNome(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="email"
                                                name="email"
                                                label="Email"
                                                fullWidth
                                                autoComplete="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="labelTipo">Tipo usuário</InputLabel>
                                                <Select
                                                    labelId="labelTipo"
                                                    id="tipo"
                                                    value={tipo}
                                                    onChange={e => setTipo(e.target.value)}
                                                >
                                                    <MenuItem value={1}>Administrador</MenuItem>
                                                    <MenuItem value={2}>Funcionário</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                type="password"
                                                required
                                                id="senha"
                                                name="senha"
                                                label="Senha"
                                                fullWidth
                                                autoComplete="senha"
                                                value={senha}
                                                onChange={e => setSenha(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>

                        <Divider />

                        <AccordionActions>
                            <Button
                                onClick={goBack}
                                variant="contained"
                                className={classes.button}
                                startIcon={<ChevronLeftIcon />}
                            >
                                Voltar
                        </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<CachedIcon />}
                            >
                                Limpar
                        </Button>

                            <Button
                                variant="contained"

                                color="primary"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                            >
                                Salvar
                        </Button>
                        </AccordionActions>
                    </Accordion>
                </Container>
            </main>
        </div>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: 15,
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    formControl: {
        width: '100%',
    },
    button: {
        margin: theme.spacing(1),
    },

    //coloquei agora

    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));