const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    nmCliente: String,
    flSexo: {type: Number, default: 1}, //Masculino ou Feminino
    flTipo: {type: Number, default: 1}, //Fisica ou Juridica
    nrCPF: String,
    nrRG: String,
    nrIE: String,
    nrCNPJ: String,
    dtNascimento: Date,
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
    phoneclients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PhoneClient',
    }]
},{
    timestamps: true
});

const clients = mongoose.model('clients', DataSchema);

module.exports = clients;