import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ExitToApp from '@mui/icons-material/ExitToApp';
import HouseIcon from '@mui/icons-material/House';
import BuildIcon from '@mui/icons-material/Build';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import Swal from 'sweetalert2';
import api from '../services/api';
import { getToken, logout } from '../services/auth';

export const mainListItems = (open) => (
  <>
    {open ? (
      <ListItem disablePadding style={{ justifyContent: 'center', padding: '8px 16px' }}>
        <IconButton
          style={{
            background: '#00AB55',
            color: '#FFF',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            width: '100%'
          }}
          href={'/admin/pedidos/create'}
          size='large'
        >
          <AddCircleRoundedIcon style={{ marginRight: 8 }} />
          Novo pedido
        </IconButton>
      </ListItem>
    ) : (
      <Tooltip title="Novo pedido">
        <ListItem disablePadding style={{ justifyContent: 'center' }}>
          <IconButton
            style={{
              background: '#00AB55',
              color: '#FFF',
              borderRadius: 10,
              padding: 12,
            }}
            href="/admin/pedidos/create"
          >
            <AddCircleRoundedIcon />
          </IconButton>
        </ListItem>
      </Tooltip>
    )}

    <ListItem button component="a" href="/admin">
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <HouseIcon />
      </ListItemIcon>
      <ListItemText primary="Painel" sx={{ color: '#7F8F97' }} />
    </ListItem>
    <ListItem button component="a" href="/admin/clientes">
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Clientes" sx={{ color: '#7F8F97' }} />
    </ListItem>
    <ListItem button component="a" href="/admin/materiais">
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <BuildIcon />
      </ListItemIcon>
      <ListItemText primary="Materiais" sx={{ color: '#7F8F97' }} />
    </ListItem>
    <ListItem button component="a" href="/admin/pedidos">
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Pedidos" sx={{ color: '#7F8F97' }} />
    </ListItem>
    <ListItem button component="a" href="/admin/usuarios">
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Usuários" sx={{ color: '#7F8F97' }} />
    </ListItem>
    <ListItem button onClick={confirmSair}>
      <ListItemIcon sx={{ color: '#7F8F97' }}>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Sair" sx={{ color: '#7F8F97' }} />
    </ListItem>
  </>
);

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset style={{ color: "#B7C0CD" }}>OPÇÕES</ListSubheader>

//     <ListItem button component="a" href="/admin/usuarios">
//       <ListItemIcon style={{ color: "#7F8F97" }}>
//         <PersonAddIcon />
//       </ListItemIcon>
//       <ListItemText style={{ color: "#7F8F97" }} primary="Usuários" />
//     </ListItem>
//     <ListItem button onClick={confirmSair}>
//       <ListItemIcon style={{ color: "#7F8F97" }}>
//         <ExitToApp />
//       </ListItemIcon>
//       <ListItemText style={{ color: "#7F8F97" }} primary="Sair" />
//     </ListItem>
//   </div>
// );

async function confirmSair() {
  const result = Swal.fire({
    icon: 'warning',
    text: 'Deseja realmente sair do sistema?',
    showCloseButton: true,
    confirmButtonText: 'Sim, sair!',
    confirmButtonColor: '#D33333',
    showCancelButton: true,
    cancelButtonText: 'Não',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      const response = await api.get("/api/users/destroytoken", {
        headers: { token: getToken() }
      });

      if (response.status === 200) {
        logout();
        window.location.href = '/admin/login';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao sair',
          text: 'Não foi possível encerrar a sessão.',
        });
      }
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao tentar sair. Tente novamente.',
      });
    }
  }
}