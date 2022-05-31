const Client = require('../models/ClientModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../../client/public/images')
    },

    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fieldSize: '5000000' },
    fileFilter: (req, file, callback) => {
        const fileTypes = /jpeg|jpg|png/
        const mimeType = fileTypes.test(file.mimeType)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return callback(null, true)
        }
        callback('Informe apenas extensão de imagem')
    }
}).single('image');

module.exports = {
    async index(req, res){
        const client = await Client.find();

        res.json(client);
    },

    //ADD CLIENT
    async create(req, res) { 
        try {
            const model  = req.body

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