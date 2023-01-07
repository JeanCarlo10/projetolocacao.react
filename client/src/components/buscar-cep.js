import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import apiCEP from '../services/apiCEP';
import Notification from '../components/notification';
import { mask, unMask } from 'remask';

export default function BuscarCep(props) {
    const classes = useStyles();

    const { onUpdate, initialData } = props;

    const [numero, setNumero] = useState(initialData.numero || "");
    const [complemento, setComplemento] = useState(initialData.complemento || "");
    const [logradouro, setLogradouro] = useState(initialData.logradouro || "");
    const [bairro, setBairro] = useState(initialData.bairro || "");
    const [cidade, setCidade] = useState(initialData.cidade || "");
    const [uf, setUf] = useState(initialData.uf || "");
    const [cep, setCep] = useState(initialData.cep || "");
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    useEffect(() => {
        onUpdate && onUpdate({
            numero,
            complemento,
            logradouro,
            bairro,
            cidade,
            uf,
            cep
        });
    }, [numero, complemento, logradouro, bairro, cidade, uf, cep]);

    const handleChangeCEP = (event) => {
        setCep(mask(unMask(event.target.value), ['99999-999']));
    }

    async function handleSearchCEP(res, req) {
        if (cep === '') {
            setNotify({
                isOpen: true,
                message: 'Por favor, informe o cep!',
                type: 'warning'
            });

            return;
        }
        try {
            const response = await apiCEP.get(`${cep}/json`);
            const { data } = response;
            const { logradouro, bairro, localidade, uf } = data;

            setLogradouro(logradouro);
            setBairro(bairro);
            setCidade(localidade);
            setUf(uf);

        } catch {
            setNotify({
                isOpen: true,
                message: 'CEP inválido!',
                type: 'error'
            });
            setCep("");
        }
    }

    return (
            <form>
                <Box display="flex" flexDirection="column" className={classes.boxCustom}>
                    <Notification notify={notify} setNotify={setNotify} />
                    <Typography style={{ padding: '15px 15px 0px 15px', color: '#00AB55', fontWeight: 'bold' }}>
                        Endereço
                        <Divider variant="fullWidth" />
                    </Typography>

                    <Grid container direction="column" padding={2} spacing={2}>
                        <Grid container item direction="row">
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl size="small" variant="outlined">
                                    <InputLabel htmlFor="cep">CEP</InputLabel>
                                    <OutlinedInput
                                        value={cep}
                                        fullWidth
                                        onChange={handleChangeCEP}
                                        labelWidth={120}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleSearchCEP}
                                                    edge="end"
                                                >
                                                    <SearchOutlinedIcon color="success" />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="CEP"
                                    />
                                </FormControl>

                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} className={classes.aligns}>
                            <Grid item xs={12} sm={6} md={6} >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Bairro"
                                    value={bairro}
                                    onChange={e => setBairro(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Logradouro"
                                    value={logradouro}
                                    onChange={e => setLogradouro(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} className={classes.aligns}>
                            <Grid item xs={12} sm={8} md={10}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    label="Cidade"
                                    value={cidade}
                                    onChange={e => setCidade(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} md={2}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    label="Estado"
                                    value={uf}
                                    onChange={e => setUf(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2} className={classes.aligns}>
                            <Grid item xs={12} sm={4} md={3}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    label="Número"
                                    value={numero}
                                    onChange={e => { setNumero(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8} md={9}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    label="Complemento"
                                    value={complemento}
                                    onChange={e => setComplemento(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
    );
}

const useStyles = makeStyles((theme) => ({
    boxCustom: {        
        border: "1px solid #E0E1E0",
        borderLeft: "5px solid #00AB55",
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        borderTopRightRadius: "5px",
        borderBottomRightRadius: "5px",
    },
    aligns: {
        paddingLeft: "8px !important",
        paddingRight: "8px !important",
        paddingTop: "0px !important",
        paddingBottom: "0px !important"
    }
}));

