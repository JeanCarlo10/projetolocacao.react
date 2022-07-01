import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import SaveIcon from '@material-ui/icons/Save';

import MenuAdmin from '../../../components/menu-admin';
import api from '../../../services/api';

export default function EditMaterial() {
    const classes = useStyles();

    const [nomeMaterial, setNomeMaterial] = useState('');
    const { idMaterial } = useParams();

    useEffect(() => {
        async function getMaterial() {
            var response = await api.get('/api/materials.details/' + idMaterial);

            setNomeMaterial(response.data.nomeMaterial);
        }

        getMaterial();
    }, []);

    function handleClear() {
        setNomeMaterial('');
    }

    async function handleSubmit() {
        const data = {
            nomeMaterial: nomeMaterial,
            _id: idMaterial
        }

        if (nomeMaterial != '') {
            const response = await api.put('/api/materials', data);

            if (response.status == 200) {
                window.location.href = '/admin/materiais'
            } else {
                alert('Erro ao atualizar o material');
            }
        } else {
            alert('Campos obrigatórios');
        }
    }

    return (
        <div className={classes.root}>
            <MenuAdmin/>
            <main className={classes.content}>
                
            <Container maxWidth="lg" component="main" className={classes.container}>
            
                <CardHeader
                    title="Editar material"
                    subheader={
                    <Breadcrumbs style={{ fontSize: 14 }} separator="•"  aria-label="breadcrumb">
                        <Link color="inherit" href={'/admin/materiais'} >
                            Materiais
                        </Link>
                        <Typography color="textPrimary" style={{ fontSize: 14 }}>Editar material</Typography>
                    </Breadcrumbs>
                    }
                    titleTypographyProps={{ align: 'left' }}
                    subheaderTypographyProps={{ align: 'left' }}
                    className={classes.cardHeader}
                />
                
                <Card style= {{ borderRadius: 15 }}>
                    <form onSubmit={handleSubmit}>
                        <CardContent className={classes.inputs}>
                            <TextField
                                required
                                autoFocus
                                variant="outlined"
                                size="small"
                                label="Descrição"
                                value={nomeMaterial}
                                onChange={e => setNomeMaterial(e.target.value)}
                            />
                        </CardContent>
                        <CardActions style={{ justifyContent: 'flex-end', marginRight: 15 }}>
                            <Button variant="contained" size="medium" className={classes.btnDefaultGreen} type="submit" startIcon={<SaveIcon />}>Salvar</Button>
                        </CardActions>
                    </form>
                </Card>   
            </Container>
            </main>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    cardHeader: {    
        "& .MuiCardHeader-title": {
          fontWeight: 700,
          color: '#212B36',
          marginBottom: theme.spacing(1),
        },
      },
    container: {
        marginTop: 90
    },
    inputs: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },

        '& label.Mui-focused': {
            color: '#00AB55',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
            borderColor: '#dce0e4',
            },
            '&:hover fieldset': {
            borderColor: '#3d3d3d',
            },
            '&.Mui-focused fieldset': {
            borderColor: '#00AB55',
            },
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '50%',
    },
    btnDefaultGreen: {
        background: '#00AB55',
        color: '#FFF',
        borderRadius: 10,
        border: 'none',
        textTransform: 'none',
        boxShadow: 'none',
    
        '&:hover': {
          backgroundColor: '#007B55',
          color: '#FFF',
        },
      },
    appBarSpacer: theme.mixins.toolbar,
}));