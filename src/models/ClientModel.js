const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    nmCliente: String,
    nmRazaoSocial: String,
    flSexo: {type: Number, default: 1}, //Masculino ou Feminino
    flTipo: {type: Number, default: 1}, //Fisica ou Juridica
    nrCPF: String,
    nrRG: String,
    nrIE: String,
    nrCNPJ: String,
    dtNascimento: String,
    dsEmail: String,
    image: String,

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