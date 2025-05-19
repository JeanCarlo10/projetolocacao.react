import React, { useEffect, useState } from 'react';
import api from './api';
import { login, logout, getToken } from './auth';
import { styled } from '@mui/material/styles';
import { Route, Redirect } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  '&.MuiLinearProgress-colorPrimary': {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 700],
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: '#00AB55',
  },
}));

export default function WAuth({ component: Component, ...rest }) {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const res = await api.get('/api/users/checktoken', {
          params: { token: getToken() },
        });

        if (res.data.status === 200) {
          setLoading(false);
          setRedirect(false);
        } else {
          logout();
          setLoading(false);
          setRedirect(true);
        }
      } catch (err) {
        // Se der erro na requisição, trata como token inválido
        logout();
        setLoading(false);
        setRedirect(true);
      }
    }

    verify();
  }, []);

  return loading ? (
    <BorderLinearProgress
      variant="indeterminate"
      sx={{ width: '80%', margin: '80px auto', display: 'block' }}
    />
  ) : (
    <Route
      {...rest}
      render={(props) =>
        !redirect ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/admin/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}