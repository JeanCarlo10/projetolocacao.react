const Rent = require('../models/RentModel');

module.exports = {
    index(req, res) {
        const pedido = Rent.get();

        let statusCount = {
            //Pendente, Entregue, Devolvido, Atrasado ou Cancelado
            pendente: 0,
            devolvido: 0,
            atrasado: 0,
            cancelado: pedido.legth
        }

    }
}