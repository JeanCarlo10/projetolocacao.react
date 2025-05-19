import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import Notification from '../../../components/notification';
import api from '../../../services/api';
import { login, setNameUser, setIdUser } from '../../../services/auth';
import FormControl from '@mui/material/FormControl';
import ImageLogin from '../../../assets/img/image_login.svg';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

  async function handleSubmit() {
    // setLoading(true);
    try {
      const res = await api.post('/api/users/login', { email, senha }, { withCredentials: true });

      console.log(res.data);
      
      if (res.status === 200 && res.data.status === 1) {
        //salva no localstorage
        // token:token,id_client:user._id,user_name:user.nmUsuario 
        login(res.data.token);
        setIdUser(res.data.id_client);
        setNameUser(res.data.user_name);
        window.location.href = '/admin'
      } else {
        setNotify({
          isOpen: true,
          message: 'Atenção: ' + res.data.error,
          type: 'error'
        });
      }
    } catch (error) {
      setNotify({
        isOpen: true,
        message: 'Erro ao conectar com o servidor.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  function loadSubmit() {
    setLoading(true);
    setTimeout(() => handleSubmit(), 1000);
  }

  function FacebookCircularProgress(props) {
    // const classes = useStylesFacebook();

    return (
      <div>
        <CircularProgress
          variant="determinate"
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          // classes={{
          //   circle: classes.circle,
          // }}
          size={40}
          thickness={4}
          {...props}
        />
      </div>
    );
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Notification notify={notify} setNotify={setNotify} />

      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: `url(${ImageLogin})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#F5F5F5',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' }
        }}
      />

      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        container
        alignItems="center"
        justifyContent="center"
      >
        <Box sx={{ mx: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Insira os dados abaixo
          </Typography>

          <form>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Digite seu email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="password">Digite sua senha</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Digite sua senha"
              />
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={loadSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress color={'inherit'} size={24} /> : 'Entrar'}
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}