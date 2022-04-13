import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { TextField, InputLabel, FormControl, Divider } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import apiCEP from '../services/apiCEP';
import { mask, unMask } from 'remask';

export default function BuscarCep(props) {
    const classes = useStyles(); 
    
    const { onUpdate } = props;

    const [nrEndereco, setNrEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [cep, setCep] = useState('');

    useEffect(() => {
        onUpdate && onUpdate({
            nrEndereco, 
            complemento, 
            logradouro, 
            bairro, 
            cidade, 
            uf, cep
        });
    }, [nrEndereco, complemento, logradouro, bairro, cidade, uf, cep]);

    const handleChangeCEP = (event) => {
        setCep(mask(unMask(event.target.value), ['99999-999']));
    }

    async function handleSearchCEP() {
        if (cep === '') {
            alert('Por favor, informe o cep!')
            
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
            
        }catch {
            alert("CEP inválido!");
        }
    }

    return (
        <Box sx={{
            border: "1px solid #E0E1E0",
            borderLeft: "5px solid #00AB55",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px"
            }}    
        >
        <Paper elevation={0} sx={{ p:2 }}>
            <Typography  style={{ marginBottom: 15, color: '#00AB55', fontWeight: 'bold' }}>
                Endereço 
                <Divider variant="fullWidth" />
            </Typography>

          <form>
              <FormControl size="small" variant="outlined">
                <InputLabel htmlFor="cep">CEP</InputLabel>
                <OutlinedInput
                value={cep}
                onChange={handleChangeCEP}
                labelWidth={120}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        onClick={handleSearchCEP}
                        edge="end"
                    >
                        <SearchOutlinedIcon color="success"/> 
                    </IconButton>
                    </InputAdornment>
                }                
                />
            </FormControl>

            <Box className={classes.twoInputs}>
                <TextField
                    variant="outlined"
                    size="small"
                    label="Bairro"
                    value={bairro}
                    onChange={e => setBairro(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    size="small"
                    label="Logradouro"
                    value={logradouro}
                    onChange={e => setLogradouro(e.target.value)}
                />
            </Box>

            <Box style={{ marginLeft: -7}}>
                <TextField style={{ minWidth: '74%'}}
                    variant="outlined"
                    size="small"
                    label="Cidade"
                    value={cidade}
                    onChange={e => setCidade(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    size="small"
                    label="Estado"
                    value={uf}
                    onChange={e => setUf(e.target.value)}
                />
            </Box>

            <Box style={{ marginLeft: -7}}>
                <TextField
                    variant="outlined"
                    size="small"
                    label="Número"
                    value={nrEndereco}
                    onChange={e => {
                        setNrEndereco(e.target.value);
                        onUpdate();
                    }}
                />
                <TextField style={{ minWidth: '74%'}}
                    variant="outlined"
                    size="small"
                    label="Complemento"
                    value={complemento}
                    onChange={e => setComplemento(e.target.value)}
                />
            </Box> 
          </form>
             
        </Paper> 
      </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    twoInputs: {
        display: 'flex',
        marginLeft: -7,
        '& .MuiTextField-root': {
        // margin: theme.spacing(1),
            width: '50%',
        },
    },
}));

