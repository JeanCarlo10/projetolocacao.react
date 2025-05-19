import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import apiCEP from '../services/apiCEP';
import Notification from '../components/notification';
import { mask, unMask } from 'remask';

export default function BuscarCep(props) {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const { initialData, onFieldChange } = props;
    const [loadingCep, setLoadingCep] = useState(false);
    const [endereco, setEndereco] = useState({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setEndereco(initialData);
        }
    }, [initialData]);


    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setEndereco((prev) => ({ ...prev, [field]: value }));

        // Envia a mudança para o componente pai
        onFieldChange?.(field, value);
    };

    async function handleSearchCEP() {
        const cleanedCep = unMask(endereco.cep);

        if (!cleanedCep || cleanedCep.length !== 8) {
            setNotify({
                isOpen: true,
                message: 'Por favor, informe um CEP válido com 8 dígitos!',
                type: 'warning'
            });
            return;
        }

        try {
            setLoadingCep(true);
            const response = await apiCEP.get(`${cleanedCep}/json`);
            const { data } = response;

            if (data.erro) {
                throw new Error('CEP não encontrado!');
            }

            const { logradouro, bairro, localidade, uf } = data;

            const updatedFields = {
                logradouro: logradouro || '',
                bairro: bairro || '',
                cidade: localidade || '',
                uf: uf || '',
            };

            // Atualiza estado local
            setEndereco((prev) => ({
                ...prev,
                ...updatedFields
            }));

            // Atualiza o componente pai
            Object.entries(updatedFields).forEach(([key, value]) => {
                onFieldChange?.(key, value);
            });
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || 'Erro ao buscar o CEP!',
                type: 'error'
            });

            const clearedFields = {
                cep: '',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                uf: ''
            };

            setEndereco(clearedFields);

            Object.entries(clearedFields).forEach(([key, value]) => {
                onFieldChange?.(key, value);
            });
        } finally {
            setLoadingCep(false);
        }
    }

    return (
        <Box sx={{
            borderRadius: '8px',
            border: "1px solid #E0E1E0",
            boxShadow: "none",
        }}
        >
            <Notification notify={notify} setNotify={setNotify} />

            <Box
                sx={{
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    background: '#717171',
                    color: '#FFF',
                    fontWeight: 700,
                    padding: "8px 16px",
                    fontFamily: "Nunito"
                }}
            >
                <h3>ENDEREÇO</h3>
            </Box>

            <Card>
                <CardContent style={{ padding: 24 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl size="medium" variant="outlined">
                                <InputLabel htmlFor="cep">CEP</InputLabel>
                                <OutlinedInput
                                    value={endereco.cep}
                                    onChange={(e) => {
                                        const value = mask(unMask(e.target.value), ['99999-999']);
                                        handleChange('cep')({ target: { value } });
                                    }}
                                    onBlur={handleSearchCEP}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                disabled={loadingCep}
                                            >
                                                {loadingCep ? (
                                                    <CircularProgress size={16} style={{ color: '#00AB55' }} />
                                                ) : (
                                                    <SearchOutlinedIcon style={{ color: '#00AB55' }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="CEP"
                                    disabled={loadingCep}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={8} md={10}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Logradouro"
                                value={endereco.logradouro}
                                onChange={handleChange('logradouro')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Número"
                                value={endereco.numero}
                                onChange={handleChange('numero')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={8} md={10} >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Cidade"
                                value={endereco.cidade}
                                onChange={handleChange('cidade')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Estado"
                                value={endereco.uf}
                                onChange={handleChange('uf')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Bairro"
                                value={endereco.bairro}
                                onChange={handleChange('bairro')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="medium"
                                label="Complemento"
                                value={endereco.complemento}
                                onChange={handleChange('complemento')}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}