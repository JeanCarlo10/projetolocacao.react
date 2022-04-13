const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema({
    Status: {type: String, default: 'Entrega'}, //Entrega ou Retirada
    // vlTotalGeral: Decimal,
    dsObservacao: String,

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
    products: { type: Array, "default":[] } 

    // clientes: [
    //     {
    //         type: Array,
    //     }
    // ],
},{
    timestamps: true
});

const rents = mongoose.model('rents', DataSchema);

module.exports = rents;