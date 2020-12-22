import React, { useEffect, useState } from 'react';
import api from './api';
import { login, logout, getToken } from './auth';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Route, Redirect } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function WAuth ({ component: Component, ...rest }){
    const [redirect, setRedirect ] = useState(false);
    const [loading, setLoading ] = useState(true);

    const BorderLinearProgress = withStyles((theme) => ({
        root: {
          height: 10,
          borderRadius: 5,
        },
        colorPrimary: {
          backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
          borderRadius: 5,
          backgroundColor: '#1a90ff',
        },
      }))(LinearProgress);

    useEffect(() => {
        async function verify() {
            var res = await api.get('/api/users/checktoken', {params: {token: getToken() }});

            if (res.data.status == 200){
                //O token está valido
                setLoading(false);
                //Pq já tá logado e o token valido. E não preciso mandar pra pagina de login
                setRedirect(false);
            }else{
                //Logout pra limpar tudo do localStorage
                logout();
                //Já carregou
                setLoading(false);
                //Token não é valido, e usuário deverá fazer login novamente
                setRedirect(true);
            }
        }
        setTimeout(() => verify(), 1000);
        //verify();
    }, [])

    return (
        loading ? <BorderLinearProgress variant="indeterminate" style={{ width: '80%', margin:'80px auto' }} />: <Route { ...rest } 
        render = {props => !redirect ? (
            <Component { ...props } />
        ): <Redirect to = {{pathname: "/admin/login", state: {from: props.location }}} />
        }/>
    )
}