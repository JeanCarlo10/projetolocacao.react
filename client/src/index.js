import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { ptBR } from 'date-fns/locale'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Public Sans, sans-serif',
  },
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