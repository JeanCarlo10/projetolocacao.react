import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputLabel, FormControl, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SaveIcon from '@material-ui/icons/Save';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { PhotoOutlined } from '@material-ui/icons';

import FormData from "form-data";
import api from '../../../services/api';
import { mask, unMask } from 'remask';
import MenuAdmin from '../../../components/menu-admin';
import BuscarCEP from '../../../components/buscar-cep';
import ListaContatos from '../../../components/lista-contatos';
import Notification from '../../../components/notification';

export default function CreateCliente() {
  const classes = useStyles();

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipo, setTipo] = useState('Fisica');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [ie, setIe] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [contatos, setContatos] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState({});
  const [file, setFile] = useState(null);
  const [photoId, setPhotoId] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (tipo == 'Fisica') {
      setCnpj("");
      setIe("");
    } else {
      setNome("");
      setCpf("");
      setRg("");
      setSexo("");
      setNascimento("");
    }
  }, [tipo])

  const previewAvatar = (e) => {
    if (e.target.files.length !== 0) {
      setFile({ image: URL.createObjectURL(e.target.files[0]) })
    }
  }

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 450, height: 400 }
      }).then(stream => {
        let video = videoRef.current;

        video.srcObject = stream;
        video.play();
      }).catch(err => {
        console.error(err);
      })
  }

  const takePhoto = () => {
    const width = 400;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  }

  const closePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    ctx.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
  }

  // useEffect(() => {
  //   getVideo();
  // }, [videoRef]);

  const handleTipoPessoaChange = (e) => {
    setTipo(e.target.value);
  };

  const handleSexoChange = (e) => {
    setSexo(e.target.value);
  };

  const handleSearchCEP = (data) => {
    setDadosEndereco(data);
  }

  const handleAddContato = (contato) => {
    setContatos([...contatos, contato]);
  }

  const handleDeleteContato = (contato) => {
    const updatedContacts = contatos.filter((item) => item.id !== contato);

    setContatos(updatedContacts);
  }

  const handleChangeCPF = (event) => {
    setCpf(mask(unMask(event.target.value), ['999.999.999-99']));
  }

  const handleChangeCNPJ = (event) => {
    setCnpj(mask(unMask(event.target.value), ['99.999.999/9999-99']));
  }

  const handleChangeDataNascimento = (event) => {
    setNascimento(mask(unMask(event.target.value), ['99/99/9999']));
  }

  const onUploadImage = async () => {
    const formdata = new FormData();
    formdata.append("avatar", file);

    const results = await api.post('http://localhost:5000/api/clients/upload-avatar', formdata, {
      method: "POST",
      body: formdata,
    });
    setPhotoId(results.data._id);
    console.log(results);
  }

  const deleteImage = (e) => {
    e.preventDefault();
    //Criar codigo para excluir do banco 
    setPhotoId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      nomeCliente: nome,
      sexo: sexo,
      tipoPessoa: tipo,
      cpf: cpf,
      rg: rg,
      ie: ie,
      cnpj: cnpj,
      dataNascimento: nascimento,
      email: email,

      //Dados Endereço
      numero: dadosEndereco.numero,
      complemento: dadosEndereco.complemento,
      logradouro: dadosEndereco.logradouro,
      bairro: dadosEndereco.bairro,
      cidade: dadosEndereco.cidade,
      uf: dadosEndereco.uf,
      cep: dadosEndereco.cep,

      //Lista de Contatos
      contacts: contatos,
    }

    if (tipo != '') {
      const response = await api.post('/api/clients', data);

      if (response.status == 200) {
        setNotify({
          isOpen: true,
          message: 'Cadastro realizado com sucesso',
          type: 'success'
        });
        window.location.href = '/admin/clientes'
      } else {
        alert('Erro ao cadastrar o cliente');
      }
    } else {
      alert('Campos obrigatórios');
    }
  }

  return (
    <div className={classes.root}>
      <Notification notify={notify} setNotify={setNotify} />
      <MenuAdmin />
      <main className={classes.content}>

        <Container maxWidth="lg" component="main" className={classes.container}>

          <CardHeader
            title="Cadastrar cliente"
            subheader={
              <Breadcrumbs style={{ fontSize: 14 }} separator="•" aria-label="breadcrumb">
                <Link color="inherit" href={'/admin/clientes'} >
                  Clientes
                </Link>
                <Typography color="textPrimary" style={{ fontSize: 14 }}>Cadastrar cliente</Typography>
              </Breadcrumbs>
            }
            titleTypographyProps={{ align: 'left' }}
            subheaderTypographyProps={{ align: 'left' }}
            className={classes.cardHeader}
          />

          <Card style={{ borderRadius: 15 }}>
            <form onSubmit={handleSubmit}>
              <CardContent className={classes.inputs}>
                <Box className={classes.containerAvatar}>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={2}>
                      <div className={classes.customAvatar}>
                        {photoId == null &&
                          <Avatar
                            sx={{ width: 126, height: 126 }}
                          />
                        }
                        {photoId != null &&
                          <Avatar
                            // src={'http://localhost:5000/api/clients/thumbnail-avatar/' + photoId}
                            src={file === '' ? '' : URL.createObjectURL(file)}
                            sx={{ width: 126, height: 126, objectFit: 'cover' }}
                          />
                        }

                      </div>
                      <Typography className={classes.textAvatar}>
                        Permitido *.jpeg, *.jpg, *.png
                        máximo 4 MB
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <div className={classes.containerOptions}>
                        <div style={{ marginBottom: 10 }}>
                          <Button size="large" variant="contained" component="label" startIcon={<InsertPhotoIcon className={classes.colorIcon} />}>
                            Selecionar foto
                            <input hidden accept="image/jpeg, image/png" name="avatar" type="file" onChange={e => setFile(e.target.files[0])} />
                          </Button>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <Button onClick={getVideo} size="large" variant="contained" component="label" startIcon={<PhotoCameraIcon className={classes.colorIcon} />}>
                            Abrir câmera
                          </Button>
                        </div>
                        <div className={classes.btnOption}>
                          <Button size="small" variant="outlined" onClick={onUploadImage} >
                            Enviar
                          </Button>
                          {photoId != null && 
                            <Button size="small" variant="outlined" onClick={deleteImage} >
                              Excluir imagem
                            </Button>
                          }

                        </div>
                      </div>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={6}>
                      <div className='camera'>
                        <video ref={videoRef}></video>
                        <IconButton onClick={takePhoto} aria-label="delete">
                          <PhotoCameraIcon />
                        </IconButton>
                      </div>
                      <div>
                        <canvas ref={photoRef}></canvas>
                        <button onClick={closePhoto}>Excluir foto</button>
                      </div>
                    </Grid> */}
                  </Grid>
                </Box>

                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={tipo}
                    onChange={handleTipoPessoaChange}
                    label="Tipo de pessoa"
                  >
                    <MenuItem value={'Fisica'}>Pessoa Física</MenuItem>
                    <MenuItem value={'Juridica'}>Pessoa Jurídica</MenuItem>
                  </Select>
                </FormControl>

                {tipo == 'Fisica' &&
                  <TextField
                    variant="outlined"
                    label="Nome cliente"
                    size="small"
                    autoFocus
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                }

                {tipo == 'Juridica' &&
                  <TextField
                    variant="outlined"
                    label="Nome fantasia"
                    size="small"
                    autoFocus
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                }

                {tipo == 'Fisica' &&
                  <div className={classes.twoInputs}>
                    <TextField
                      required
                      variant="outlined"
                      size="small"
                      label="Data de nascimento"
                      value={nascimento}
                      onChange={handleChangeDataNascimento}
                    />
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                      <InputLabel>Sexo</InputLabel>
                      <Select
                        value={sexo}
                        onChange={handleSexoChange}
                        label="Sexo"
                      >
                        <MenuItem value="" />
                        <MenuItem value={'Feminino'}>Feminino</MenuItem>
                        <MenuItem value={'Masculino'}>Masculino</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                }

                <div className={classes.twoInputs}>
                  {tipo == 'Fisica' &&
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="CPF"
                      value={cpf}
                      onChange={handleChangeCPF}
                    />
                  }

                  {tipo == 'Juridica' &&
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="CNPJ"
                      value={cnpj}
                      onChange={handleChangeCNPJ}
                    />
                  }

                  {tipo == 'Fisica' &&
                    <TextField
                      className={classes.formControl}
                      variant="outlined"
                      size="small"
                      label="RG"
                      value={rg}
                      onChange={e => setRg(e.target.value)}
                    />
                  }
                  {tipo == 'Juridica' &&
                    <TextField
                      className={classes.formControl}
                      variant="outlined"
                      size="small"
                      label="IE"
                      value={ie}
                      onChange={e => setIe(e.target.value)}
                    />
                  }
                </div>

                <TextField
                  size="small"
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <BuscarCEP onUpdate={handleSearchCEP} initialData={dadosEndereco} />
                <ListaContatos contatos={contatos} addContato={handleAddContato} deleteContato={handleDeleteContato} />
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
  containerAvatar: {
    width: "100%",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#919eab52'
  },
  customAvatar: {
    width: 144,
    height: 144,
    borderRadius: '50%',
    padding: 8,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: '#919eab52'
  },
  textAvatar: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    color: '#595A4A'
  },
  colorIcon: {
    color: '#595A4A',
  },
  containerOptions: {
    display: 'flex',
    flexDirection: 'column',
  },
  btnOption: {
    marginTop: 45,
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
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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

  twoInputs: {
    display: 'flex',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '50%',
  },
  button: {
    margin: theme.spacing(0.5),
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

  // appBarSpacer: theme.mixins.toolbar,
}));