export const getTypeUser = (value) => {
    var array = ['Administrador', 'Funcionário'];

    return array[value-1];
};

export const getTypeUserLabel = (value) => {
    var array = ['primary', 'secondary'];

    return array[value-1];
};

export const getTypeClient = (value) => {
    var array = ['Física', 'Jurídica'];

    return array[value-1];
};

export const getStatusRent = (value) => {
    var array = ['Entrega', 'Retirada'];

    return array[value-1];
};