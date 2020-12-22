
const Client = require('../models/ClientModel');

module.exports = {
    async index(req, res){
        const client = await Client.find();

        res.json(client);
    },
    async create(req, res){
        const {nmCliente, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial} = req.body;

        let data = {};
        let client = await Client.findOne({nmCliente});

        if(!client){
            data = {nmCliente, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial};

            client = await Client.create(data);
            return res.status(200).json(client);
        }else{
            return res.status(500).json(client);
        }
    },
    async details(req, res){
        const {_id} = req.params;
        const client = await Client.findOne({_id});
        res.json(client);
    },
    async delete(req, res){
        const { _id } = req.params;
        const client = await Client.findByIdAndDelete({_id});
        return res.json(client);
    },
    async update(req, res){
        const {_id, nmCliente, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial} = req.body;

        const data = {nmCliente, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial};

        const client = await Client.findOneAndUpdate({_id}, data, {new:true});

        return res.json(client);
    }
}