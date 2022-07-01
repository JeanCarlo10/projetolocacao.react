const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema({
    status: { type: String, default: 'Pendente' }, //Pendente, Entregue, Devolvido, Não Devolvido ou Cancelado
    dataPedido: { type: Date, default: Date.now },
    dataEntrega: { type: Date },
    dataDevolucao: { type: Date },
    totalParcial: Number,
    totalGeral: Number,
    desconto: Number,
    observacao: String,
    numeroPedido: Number,

    idCliente: { type: mongoose.Schema.ObjectId },
    nomeCliente: { type: String },
    tipoEndereco: { type: String },
    
    //DADOS NOVO ENDEREÇO
    numero: String,
    complemento: String,
    logradouro: String,
    bairro: String,
    cidade: String,
    uf: String,
    cep: String,
    //DADOS NOVO ENDEREÇO

    //Pedidos do cliente
    products: { type: Array, "default": [] }
}, {
    timestamps: true
});

const rents = mongoose.model('rents', DataSchema);

module.exports = rents;