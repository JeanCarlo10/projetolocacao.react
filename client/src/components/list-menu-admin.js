import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import ExitToApp from '@material-ui/icons/ExitToApp';
import HouseIcon from '@material-ui/icons/House';
import BuildIcon from '@material-ui/icons/Build';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import api from '../services/api';
import { getToken, logout } from '../services/auth';

export const mainListItems = (
  <div>
    <ListItem button component="a" href="/admin" MuiListItem	>
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <HouseIcon />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Painel"/>
    </ListItem>
    <ListItem button component="a" href="/admin/clientes">
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Clientes"/>
    </ListItem>
    <ListItem button component="a" href="/admin/materiais">
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <BuildIcon />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Materiais"/>
    </ListItem>
    <ListItem button component="a" href="/admin/pedidos">
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Pedidos"/>
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset style={{ color: "#B7C0CD" }}>OPÇÕES</ListSubheader>

    <ListItem button component="a" href="/admin/usuarios">
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Usuários"/>
    </ListItem>
    <ListItem button onClick={confirmSair}>
      <ListItemIcon style={{ color: "#7F8F97" }}>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText style={{ color: "#7F8F97" }} primary="Sair" />
    </ListItem>
  </div>
);

async function confirmSair() {
  if (window.confirm("Deseja realmente sair do sistema?")){
    const response = await api.get("/api/users/destroytoken", {headers: {token: getToken()}} );

    if (response.status == 200){
      logout();
      window.location.href = '/admin/login'
    }else{
      alert("Não foi possível fazer o logout!");
    }
  }
}