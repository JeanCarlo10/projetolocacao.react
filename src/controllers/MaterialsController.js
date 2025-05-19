const Material = require('../models/MaterialModel');

module.exports = {
    async index(req, res) {
        const material = await Material.find(
            { nomeMaterial: { $regex: req.query.keyword, $options: "i" } }
        )

        res.json(material);
    },

    async detailsInProducts(req, res) {
        const material = await Material.find();

        res.json(material);
    },

    //ADD MATERIAL
    async create(req, res) {
        try {
            const model = req.body

            const material = await Material.create(model);

            await material.save();

            return res.send({ material });

        } catch (err) {
            return res.status(500).send({
                error: 'Por favor, contate o administrador! Erro ao cadastrar o material'
            })
        }
    },

    //GET MATERIALS
    async details(req, res) {
        try {
            const { _id } = req.params;
            const material = await Material.findOne({ _id });

            if (!material) {
                return res.status(404).json({ error: 'Material não encontrado.' });
            }

            res.json(material);
        } catch (error) {
            console.error('Erro ao buscar material:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    //DELETE MATERIAL
    async delete(req, res) {
        const { _id } = req.params;
        const material = await Material.findByIdAndDelete({ _id });
        return res.json(material);
    },

    //UPDATE MATERIAL
    async update(req, res) {
        const model = req.body;

        const material = await Material.findOneAndUpdate({ _id: model._id }, model, { new: true });

        return res.json(material);
    }
}