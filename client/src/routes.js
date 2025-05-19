import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from './pages/admin/dashboard/Dashboard';

import IndexCliente from './pages/admin/clientes/IndexCliente';
import CreateCliente from './pages/admin/clientes/CreateCliente';
import EditCliente from './pages/admin/clientes/EditCliente';
import OverviewCliente from './pages/admin/clientes/OverviewCliente';

import IndexMaterial from './pages/admin/materiais/IndexMaterial';
import CreateMaterial from './pages/admin/materiais/CreateMaterial';
import EditMaterial from './pages/admin/materiais/EditMaterial';

import IndexUsuario from './pages/admin/usuarios/IndexUsuario';
import CreateUsuario from './pages/admin/usuarios/CreateUsuario';
import EditUsuario from './pages/admin/usuarios/EditUsuario';

import IndexPedido from './pages/admin/pedidos/IndexPedido';
import CreatePedido from './pages/admin/pedidos/CreatePedido';
import EditPedido from './pages/admin/pedidos/EditPedido';
import OverviewPedido from './pages/admin/pedidos/OverviewPedido';

import Login from './pages/admin/login';
import PrivateRoute from './services/wAuth';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <PrivateRoute path="/admin" exact component={Dashboard} />
                <Route path="/admin/login" exact component={Login} />

                <PrivateRoute path="/admin/clientes" exact component={IndexCliente} />
                <PrivateRoute path="/admin/clientes/create" exact component={CreateCliente} />
                <PrivateRoute path="/admin/clientes/edit/:idCliente" exact component={EditCliente} />
                <PrivateRoute path="/admin/clientes/overview/:idCliente" exact component={OverviewCliente} />

                <PrivateRoute path="/admin/materiais" exact component={IndexMaterial} />
                <PrivateRoute path="/admin/materiais/create" exact component={CreateMaterial} />
                <PrivateRoute path="/admin/materiais/edit/:idMaterial" exact component={EditMaterial} />

                <PrivateRoute path="/admin/pedidos" exact component={IndexPedido} />
                <PrivateRoute path="/admin/pedidos/create" exact component={CreatePedido} />
                <PrivateRoute path="/admin/pedidos/edit/:idPedido" exact component={EditPedido} />
                <PrivateRoute path="/admin/pedidos/overview/:idPedido" exact component={OverviewPedido} />

                <PrivateRoute path="/admin/usuarios" exact component={IndexUsuario} />
                <PrivateRoute path="/admin/usuarios/create" exact component={CreateUsuario} />
                <PrivateRoute path="/admin/usuarios/edit/:idUsuario" exact component={EditUsuario} />

            </Switch>
        </BrowserRouter>
    )
}