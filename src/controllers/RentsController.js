const Rent = require('../models/RentModel');
const getNextSequence = require('../services/getNextSequence');

module.exports = {
    async index(req, res) {
        try {
            const keyword = req.query.keyword || "";
            const regex = new RegExp(keyword, "i");

            const keywordAsNumber = Number(keyword);
            const isNumeric = !isNaN(keywordAsNumber);

            const statusFilter = req.query.statuses
                ? req.query.statuses.split(",")
                : [];

            const pipeline = [
                {
                    $lookup: {
                        from: "clients", // Nome da coleção no MongoDB
                        localField: "idCliente",
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                { $unwind: "$cliente" },
                {
                    $match: {
                        $and: [
                            ...(statusFilter.length
                                ? [{ status: { $in: statusFilter } }]
                                : []),
                            {
                                $or: [
                                    // Busca por nomeCliente ou nomeFantasia
                                    { "cliente.nomeCliente": regex },
                                    { "cliente.nomeFantasia": regex },
                                    // Se for número, busca pelo número do pedido também
                                    ...(isNumeric ? [{ numeroPedido: keywordAsNumber }] : [])
                                ]
                            }
                        ]
                    }
                },
                { $sort: { dataPedido: -1 } }
            ];

            const results = await Rent.aggregate(pipeline);

            res.json(results);
        } catch (error) {
            console.error("Erro ao buscar locações:", error);
            res.status(500).json({ message: "Erro ao buscar locações." });
        }
    },

    async search(req, res) {
        try {
            const date = new Date(req.query.dataDevolucao);

            const y = date.getFullYear();
            const m = date.getMonth();

            const firstDay = new Date(y, m, 1);
            const lastDay = new Date(y, m + 1, 0, 23, 59, 59);

            // Filtros iniciais para o $match
            const matchFilters = [
                {
                    dataDevolucao: {
                        $gte: firstDay,
                        $lte: lastDay,
                    },
                },
            ];

            // Keyword para buscar no nome do cliente (que está em pedido_cliente depois do lookup)
            const keyword = req.query.keyword;
            if (keyword && keyword.trim() !== "") {
                // Não dá pra filtrar diretamente aqui, porque cliente ainda não foi carregado
                // Vamos filtrar depois no pipeline com $match no campo 'pedido_cliente.nomeCliente'
            }

            // Status
            if (req.query.statuses && req.query.statuses.trim() !== "") {
                const st = req.query.statuses.split(",");
                matchFilters.push({ status: { $in: st } });
            }

            // Pipeline do aggregate
            const pipeline = [
                { $match: { $and: matchFilters } },
                {
                    $lookup: {
                        from: "clients", // Nome da coleção cliente no MongoDB
                        localField: "idCliente",
                        foreignField: "_id",
                        as: "pedido_cliente",
                    },
                },
                { $unwind: "$pedido_cliente" }, // desestrutura para facilitar filtro e acesso
            ];

            // Se tem keyword, adiciona filtro no nomeCliente ou nomeFantasia do cliente
            if (keyword && keyword.trim() !== "") {
                const regex = new RegExp(keyword, "i");
                pipeline.push({
                    $match: {
                        $or: [
                            { "pedido_cliente.nomeCliente": regex },
                            { "pedido_cliente.nomeFantasia": regex },
                        ],
                    },
                });
            }

            // Ordena pelo _id descendente (ou outro campo que preferir)
            pipeline.push({ $sort: { _id: -1 } });

            const result = await Rent.aggregate(pipeline);

            res.json(result);
        } catch (error) {
            console.error("Erro no search:", error);
            res.status(500).json({ message: "Erro ao buscar pedidos." });
        }
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
            var data = req.body;

            // Garante número de pedido único e sequencial
            const numeroPedido = await getNextSequence('numeroPedido');
            data.numeroPedido = numeroPedido;

            const rent = await Rent.create(data);

            return res.status(200).json(rent);
        } catch (err) {
            console.error('Erro ao criar pedido:', err);
            return res.status(500).json({
                error: 'Por favor, contate o administrador! Erro ao cadastrar o pedido'
            });
        }
    },

    //GET RENTS
    async details(req, res) {
        const { _id } = req.params;

        const rent = await Rent.findById(_id).populate('idCliente');
        res.json(rent);
    },

    //GET RENTS - OVERVIEW
    async overview(req, res) {
        const { _id } = req.params;

        try {
            const rent = await Rent.findById({ _id })
                .populate('idCliente')
                .populate('products.idProduto');

            if (!rent) {
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }

            res.json(rent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar pedido' });
        }
    },

    //UPDATE RENT
    async update(req, res) {
        const model = req.body;

        const rent = await Rent.findOneAndUpdate({ _id: model._id }, model, { new: true });

        return res.json(rent);
    }
}