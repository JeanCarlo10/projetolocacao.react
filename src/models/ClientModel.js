const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    nomeCliente: String,
    nomeFantasia: String,
    sexo: {type: String, default: ""}, //Masculino ou Feminino
    tipoPessoa: {type: String, default: 'Fisica'}, //Fisica ou Juridica
    cpf: String,
    rg: String,
    ie: String,
    cnpj: String,
    dataNascimento: String,
    email: String,
    foto: { type: String, default: '' },
    
    //DADOS CEP
    numero: String,
    complemento: String,
    logradouro: String,
    bairro: String,
    cidade: String,
    uf: String,
    cep: String,
    //DADOS CEP

    //Contatos de telefone do cliente
    contacts: {type: Array, "default":[]} 
},{
    timestamps: true
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;