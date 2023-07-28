import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { ptBR } from 'date-fns/locale'

const theme = createTheme({
  typography: {
    fontFamily: 'Public Sans, sans-serif',
  },

  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#00AB55',
      },
    },
    MuiPickersDay: {
      day: {
        color: 'black',
      },
      daySelected: {
        backgroundColor: '#00AB55',
        '&:hover': {
          backgroundColor: '#007B55'
        },
      },
      dayDisabled: {
        color: '#ccc',
      },
      current: {
        color: '#00AB55',
      },
    },
    MuiTypography: {
      colorPrimary: {
        color: '#00AB55',
      }
    },
    MuiButton: {
      textPrimary: {
        color: '#00AB55 !important',
        '&:hover': {
          backgroundColor: '#00ab5514 !important'
        },
      }
    },
  }
  // palette: {
  //   primary: {
  //     main: '#DCF1D7',
  //   },
  //   secondary: {
  //     main: '#F7DBDB',
  //   }
  // },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <App />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);