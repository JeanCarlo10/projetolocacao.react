
const Rent = require('../models/RentModel');

module.exports = {
    async index(req, res){
        const rent = await Rent.find();

        res.json(rent);
    },

    //ADD RENT
    async create(req, res){
        const newRent = new Rent(req.body);

        try{
            const savedRent = await newRent.save();
            res.status(200).json(savedRent);
        
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //GET RENT
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
        const {_id, nmCliente, status, vlTotalGeral, dsObservacao, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP } = req.body;

        const data = {nmCliente, status, vlTotalGeral, dsObservacao, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP};

        const rent = await Rent.findOneAndUpdate({_id}, data, {new:true});

        return res.json(rent);
    }
}