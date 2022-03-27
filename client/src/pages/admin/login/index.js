import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
// import OutlinedInput from '@mui/material/OutlinedInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
// import IconButton from '@mui/material/IconButton';

import InputLabel from '@material-ui/core/InputLabel';
// import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import InputAdornment from '@mui/material/InputAdornment';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Visibility from '@material-ui/icons/Visibility';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Notification from '../../../components/notification';
import api from '../../../services/api';
import { login, setNameUser, setIdUser } from '../../../services/auth';
import { Grid } from '@material-ui/core';
import Paper from '@mui/material/Paper';
// import FormControl from '@mui/material/FormControl';
import FormControl from '@material-ui/core/FormControl';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

export default function SignIn() {
  const classes = useStyles();

  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ notify, setNotify ] = useState( { isOpen: false, message: '', type: ''} );

  async function handleSubmit() {
    // setLoading(true);

    await api.post('/api/users/login', { email, senha })
      .then(res => {
        if (res.status == 200) {
          if (res.data.status == 1) {
            //salva no localstorage
            // token:token,id_client:user._id,user_name:user.nmUsuario 
            login(res.data.token);
            setIdUser(res.data.id_client);
            setNameUser(res.data.user_name);

            window.location.href = '/admin'
          } else if (res.data.status == 2) {
            setNotify({
              isOpen: true,
              message: 'Atenção: '+ res.data.error,
              type: 'error'
            });
            //alert('Atenção: ' + res.data.error);
          }
          setLoading(false);
        } else {
          alert('Erro no servidor');
          setLoading(false);
        }
      })
  }

  function loadSubmit() {
      setLoading(true);

      setTimeout(
        () => handleSubmit(),
        2000 
      );
  }

  function FacebookCircularProgress(props) {
    const classes = useStylesFacebook();
  
    return (
      <div className={classes.root}>
        <CircularProgress
          variant="determinate"
          className={classes.bottom}
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={40}
          thickness={4}
          {...props}
        />
      </div>
    );
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    
    <Container component="main" maxWidth="xl">
      <CssBaseline />

      <Notification notify={notify} setNotify={setNotify} />
          {/* <Box
                component="img"
                src="src={require('../assets/logo.svg')} style={{marginRight: 130 }} width={40} height={40}"
                src="../../../assets/Mobile login-bro.svg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              /> */}
          {/* <Grid container>
            <img src={require('../../../assets/Mobile login-bro.svg')} />
        </Grid> */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <Box>
              <Paper>
                <img src={require('../../../assets/Mobile login-bro.svg')} />
              </Paper>
            </Box>
        </Grid>
        <Grid item xs={6} >
          <Box p={10} className={classes.inputs}>
            <Typography style={{ fontSize:24, fontWeight: 700, color: '#212B36' }}>
              Login
            </Typography>
            <Typography style={{ fontSize: 16, fontWeight: 400, color: '#637381' }}>
              Insira os dados abaixo
            </Typography>

            <TextField 
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Digite seu email"
              name="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="password">Digite sua senha</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={e => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={120}
              />
            </FormControl>

            <Button 
              fullWidth
              variant="contained"
              // size='medium'
              className={classes.btnDefaultGreen}
              onClick={loadSubmit}
              disabled={loading}
            >
              {loading ? <FacebookCircularProgress /> : 'Entrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <div className={classes.paper}>
        {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Esqueceu sua senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
      </div>
      <Box mt={8}>
        {/* <Copyright /> */}
      </Box>
    </Container>
  );
}

const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
  
}));

const useStyles = makeStyles((theme) => ({
  // paper: {
  //   marginTop: theme.spacing(8),
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },

  // avatar: {
  //   margin: theme.spacing(1),
  //   backgroundColor: theme.palette.secondary.main,
  // },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  inputs: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',

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
  btnDefaultGreen: {
    background: '#00AB55',
    color: '#FFF',
    borderRadius: 5,
    border: 'none',
    textTransform: 'none',
    boxShadow: 'none',
    margin: theme.spacing(3, 0, 2),

    '&:hover': {
      backgroundColor: '#007B55',
      color: '#FFF',
    },
  },
}));