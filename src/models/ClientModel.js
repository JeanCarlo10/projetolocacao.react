const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    nmCliente: String,
    flSexo: {type: Number, default: 1},
    flTipo: {type: Number, default: 1}, //Fisica ou Juridica
    nrCPF: String,
    nrRG: String,
    nrIE: String,
    nrCNPJ: String,
    //public DateTime? dtNascimento { get; set; }
    dsEmail: String,
    nrEndereco: String,
    dsComplemento: String,
    dsLogradouro: String,
    dsBairro: String,
    dsCidade: String,
    dsUF: String,
    nrCEP: String,
    nmRazaoSocial: String,
    //public byte[] byFoto
},{
    timestamps: true
});

const clients = mongoose.model('clients', DataSchema);

module.exports = clients;