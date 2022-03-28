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

    //DADOS CEP
    nrEndereco: String,
    dsComplemento: String,
    dsLogradouro: String,
    dsBairro: String,
    dsCidade: String,
    dsUF: String,
    nrCEP: String,
    //DADOS CEP

    //Contatos de telefone do cliente
    contacts: {type: Array, "default":[]} 

    //public byte[] byFoto
},{
    timestamps: true
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;