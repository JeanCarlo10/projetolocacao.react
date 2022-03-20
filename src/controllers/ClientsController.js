const Client = require('../models/ClientModel');

module.exports = {
    async index(req, res){
        const client = await Client.find();

        res.json(client);
    },

    //ADD CLIENT

    async create(req, res) { 
        try {
            const { nmCliente, contacts } = req.body
            const client = await Client.create({ nmCliente });

            await Promise.all(contacts.map(async contact => {
                const clientContact = new Contact({ ...contact });

                await clientContact.save();
                
                client.contacts.push(clientContact);
            }));

            await client.save();

            return res.send({ client });

        } catch (err){
            return res.status(500).send({
                 error: 'Por favor, contate o administrador! Erro ao cadastrar o cliente'
            })
        }
    },

    

    //GET CLIENTS
    async details(req, res){
        const {_id} = req.params;

        const client = await Client.findOne({_id});
        res.json(client);
    },

    //DELETE CLIENT
    async delete(req, res){
        const { _id } = req.params;
        const client = await Client.findByIdAndDelete({_id});
        return res.json(client);
    },

    //UPDATE CLIENT
    async update(req, res){
        const {_id, nmCliente, dtNascimento, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial} = req.body;

        const data = {nmCliente, dtNascimento, flSexo, flTipo, nrCPF, nrRG, nrIE, nrCNPJ, dsEmail, nrEndereco, dsComplemento, dsLogradouro, dsBairro, dsCidade, dsUF, nrCEP, nmRazaoSocial};

        const client = await Client.findOneAndUpdate({_id}, data, {new:true});

        return res.json(client);
    }
}