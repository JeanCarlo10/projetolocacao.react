
const Rent = require('../models/RentModel');

module.exports = {
    async index(req, res){
        const rent = await Rent.find();

        res.json(rent);
    },

    //ADD RENT
    async create(req, res) { 
        try {
            const model = req.body

            const rent = await Rent.create(model);

            await rent.save();

            return res.send({ rent });

        } catch (err){
            return res.status(500).send({
                 error: 'Por favor, contate o administrador! Erro ao cadastrar o pedido'
            })
        }
    },
    
    //GET RENTS
    async details(req, res){
        const {_id} = req.params;

        const rent = await Rent.findOne({_id});
        res.json(rent);
    },

    //DELETE RENT
    async delete(req, res){
        const { _id } = req.params;
        const rent = await Rent.findByIdAndDelete({_id});
        return res.json(rent);
    },

    //UPDATE RENT
    async update(req, res){
        const model = req.body;

        const rent = await Rent.findOneAndUpdate({_id: model._id}, model, {new:true});

        return res.json(rent);
    }
}