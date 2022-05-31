const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema({
    idRent: Number,
    status: {type: String, default: 'Pendente'}, //Pendente, Entregue, Devolvido, Atrasado ou Cancelado
    dataPedido: { type: Date, default: Date.now },
    dataEntrega: { type: Date },
    dataDevolucao: { type: Date },
    totalGeral: Number,
    observacao: String,

    //DADOS CEP
    nrEndereco: String,
    dsComplemento: String,
    dsLogradouro: String,
    dsBairro: String,
    dsCidade: String,
    dsUF: String,
    nrCEP: String,
    //DADOS CEP

    nomeCliente: { type: String},
    //Pedidos do cliente
    products: { type: Array, "default":[] } 
},{
    timestamps: true
});

const rents = mongoose.model('rents', DataSchema);

module.exports = rents;