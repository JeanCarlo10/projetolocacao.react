
const Rent = require('../models/RentModel');

module.exports = {
    async index(req, res) {
        const rent = await Rent.find();

        res.json(rent);
    },

    async search(req, res) {
        var date = new Date(req.query.dataDevolucao);

        y = date.getFullYear();
        m = date.getMonth();

        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0, 23, 59, 59);

        var query = [
            {
                dataDevolucao: {
                    $gte: firstDay,
                    $lte: lastDay,
                }
            }];

        if (req.query.keyword != null && req.query.keyword != "") {
            query.push({
                nomeCliente: { $regex: req.query.keyword, $options: "i" }
            })
        }

        if (req.query.statuses != null && req.query.statuses != "") {
            let st = req.query.statuses.split(",");

            query.push({
                status: { $in: st }
            })
        }

        const rent = await Rent.find({
            $and: query
        });

        res.json(rent);
    },

    async changeStatus(req, res) {
        const model = req.body;

        const rent = await Rent.findOneAndUpdate({ _id: model._id }, model, { new: true });

        return res.json(rent);
    },

    //STATUS DOS PEDIDOS
    async status(req, res) {
        const totalPendentes = await Rent.countDocuments({ status: "Pendente" });
        const totalEntregues = await Rent.countDocuments({ status: "Entregue" });
        const totalNaoDevolvido = await Rent.countDocuments({ status: "Não Devolvido" });

        res.json({ totalPendentes, totalEntregues, totalNaoDevolvido });
    },

    //ADD RENT
    async create(req, res) {
        try {
            var model = req.body
            // console.log(model);
            model.numeroPedido = await Rent.countDocuments() + 1;

            const rent = await Rent.create(model);

            await rent.save();

            return res.send({ rent });

        } catch (err) {
            return res.status(500).send({
                error: 'Por favor, contate o administrador! Erro ao cadastrar o pedido'
            })
        }
    },

    //GET RENTS
    async details(req, res) {
        const { _id } = req.params;

        const rent = await Rent.findOne({ _id });
        res.json(rent);
    },

    //DELETE RENT
    async delete(req, res) {
        const { _id } = req.params;
        const rent = await Rent.findByIdAndDelete({ _id });
        return res.json(rent);
    },

    //UPDATE RENT
    async update(req, res) {
        const model = req.body;

        const rent = await Rent.findOneAndUpdate({ _id: model._id }, model, { new: true });

        return res.json(rent);
    }
}