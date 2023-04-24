const Client = require('../models/ClientModel');
const Photo = require('../models/PhotoModel');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const client = await Client.find(
            { nomeCliente: { $regex: req.query.keyword, $options: "i" } }
        )

        res.json(client);
    },

    async detailsInProducts(req, res) {
        const client = await Client.find();

        res.json(client);
    },

    async thumbnailAvatar(req, res) {
        const {_id} = req.params;

        const photo = await Photo.findOne({_id});

        res.setHeader('Content-disposition', 'attachment; filename=' + photo.name);
        res.setHeader('Content-type', photo.type);
        res.write(photo.content, 'binary');

        res.end();
    },

    //UPLOAD IMAGE
    async uploadAvatar(req, res) {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'Imagem não foi carregada'
                });
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files.avatar;
                
                //send response
                const photo = await Photo.create({
                    content: avatar.data.toString("base64"),
                    name: avatar.name,
                    type: avatar.mimetype,
                    size: avatar.size,
                });
            
                await photo.save();

                return res.send(photo);
                //return res.status(200).json({ photo });
            }
            
        } catch (err) {
            return res.status(500).send({
                error: 'Por favor, contate o administrador! Erro ao cadastrar a imagem'
            })
        }
    },

    //ADD CLIENT
    async create(req, res) { 
        try {
            const model  = req.body
             console.log(model);
            const client = await Client.create(model);
            
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
        const model = req.body;

        const client = await Client.findOneAndUpdate({_id: model._id}, model, {new:true});

        return res.json(client);
    }
}