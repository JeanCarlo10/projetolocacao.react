/*Aqui são as variaveis para mexer com o LocalStorage do navegador*/
export const TOKEN_KEY = '&app-token';
export const ID_USER = '&id-user';
export const NAME_USER = '&name-user';
export const TYPE_USER = '&type-user';

export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
}

export const logout = () => {
    localStorage.clear()
}; 

export const setIdUser = id => localStorage.setItem(ID_USER, id); 
export const getIdUser = () => localStorage.getItem(ID_USER); 

export const setNameUser = name => localStorage.setItem(NAME_USER, name); 
export const getNameUser = () => localStorage.getItem(NAME_USER);

export const setTypeUser = type => localStorage.setItem(TYPE_USER, type); 
export const getTypeUser = () => localStorage.getItem(TYPE_USER); 

export const getToken = () => localStorage.getItem(TOKEN_KEY);