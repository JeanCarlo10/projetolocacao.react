import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import Notification from '../../../components/notification';
import api from '../../../services/api';
import { login, setNameUser, setIdUser } from '../../../services/auth';
import FormControl from '@material-ui/core/FormControl';
import ImageLogin from '../../../assets/img/image_login.svg';

export default function SignIn() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

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
              message: 'Atenção: ' + res.data.error,
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
      <div className={classes.rootProgress}>
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

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Notification notify={notify} setNotify={setNotify} />
      <div className={classes.columnLeft}>
        <img className={classes.image} src={ImageLogin} />
      </div>
      <div className={classes.columnRight}>
        <div className={classes.titleLogin}>
          <Typography style={{ fontSize: 24, fontWeight: 700, color: '#212B36' }}>
            Login
          </Typography>
          <Typography style={{ fontSize: 16, fontWeight: 400, color: '#637381' }}>
            Insira os dados abaixo
          </Typography>
        </div>
        <form className={classes.form}>
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
            size='large'
            className={classes.btnDefaultGreen}
            onClick={loadSubmit}
            disabled={loading}
          >
            {loading ? <FacebookCircularProgress /> : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}

const useStylesFacebook = makeStyles((theme) => ({
  rootProgress: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#00AB55',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  image: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'none'
  },
  columnLeft: {
    flexBasis: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  columnRight: {
    flexBasis: '40%',
    alignSelf: 'center'
  },
  titleLogin: {
    flexDirection: 'column',
    margin: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '32px',

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