import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '24px 32px !important'
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#FFF',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#BCBCBC',
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007B55',
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00AB55',
            borderWidth: 2,
          },
        },

        input: {
          fontSize: '16px',
          color: '#3B4251',
          fontWeight: 600,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#3B4251',
          fontWeight: 500,

          '&.Mui-focused': {
            color: '#00AB55',
          },

          '&.Mui-error': {
            color: '#F44336',
          },

          '&.Mui-error.Mui-focused': {
            color: '#F44336',
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#F44336 !important',

          '&.MuiFormHelperText-contained': {
            marginLeft: '0px',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        //Botão dentro do dialog
        textPrimary: {
          backgroundColor: '#00AB55',
          color: '#fff',

          '&:hover': {
            backgroundColor: '#08690A',
          },
        },

        contained: {
          backgroundColor: '#00AB55 !important',
          color: '#FFF !important',
          border: 'none !important',
          textTransform: 'none',
          boxShadow: 'none !important',
          fontWeight: 700,
          fontSize: 16,

          '&:hover': {
            backgroundColor: "#08690A !important",
          },
        },

        outlined: {
          backgroundColor: 'tranparent',
          borderColor: '#00AB55',
          color: '#00AB55',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: 16,

          '&:hover': {
            borderColor: '#08690A',
            backgroundColor: 'rgba(45, 206, 137, 0.1)',
          },
        }
      },
    },

    MuiTableCell: {
      styleOverrides: {
        sizeSmall: {
          padding: '6px 16px !important',
        },
      }
    },

    MuiCssBaseline: {
      styleOverrides: {
        '.MuiDayPicker-slideTransition': {
          minHeight: '205px !important',
        },
      },
    },

    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontWeight: 500,

          '&.Mui-selected': {
            backgroundColor: '#00AB55 !important',
            color: '#FFF',
          },

          '&.Mui-selected:hover': {
            backgroundColor: '#08690A',
          },

          '&:hover': {
            backgroundColor: '#F0F0F0',
          }
        },

        today: {
          border: '1px solid #00AB55 !important',

          '&:hover': {
            backgroundColor: '#E9FAE0 !important',
          }
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#3B4251',
          fontWeight: 700,

          '&.Mui-focused': {
            color: '#00AB55',
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#00AB55',

          '&.Mui-checked': {
            color: '#00AB55',
          },
        },
      },
    },

  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);