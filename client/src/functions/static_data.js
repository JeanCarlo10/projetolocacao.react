export const getTypeUser = (value) => {
    var array = ['Administrador', 'Funcionário'];

    return array[value - 1];
};

export const getTypeUserLabel = (value) => {
    var array = ['primary', 'secondary'];

    return array[value - 1];
};

export const statusFilterDashboard = [
    {
        id: 1,
        checked: false,
        label: 'Pendente'
    },
    {
        id: 2,
        checked: false,
        label: 'Entregue'
    },
    {
        id: 3,
        checked: false,
        label: 'Cancelado'
    },
    {
        id: 4,
        checked: false,
        label: 'Devolvido'
    },
    {
        id: 5,
        checked: false,
        label: 'Não Devolvido'
    },
];

export const allStatus = [
    {
        id: 1,
        label: 'Pendente'
    },
    {
        id: 2,
        label: 'Entregue'
    },
    {
        id: 3,
        label: 'Cancelado'
    },
    {
        id: 4,
        label: 'Devolvido'
    },
    {
        id: 5,
        label: 'Não Devolvido'
    },
];

// export const getStatusRent = (value) => {
//     var array = ['Pendente', 'Entregue', 'Devolvido', 'Cancelado'];

//     return array[value-1];
// };