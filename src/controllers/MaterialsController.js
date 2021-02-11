const Material = require('../models/MaterialModel');

module.exports = {
    async index(req, res){
        const material = await Material.find();

        res.json(material);
    },
    async create(req, res){
        const {nmMaterial} = req.body;

        let data = {};
        let material = await Material.findOne({nmMaterial});

        if(!material){
            data = {nmMaterial};

            material = await Material.create(data);
            return res.status(200).json(material);
        }else{
            return res.status(500).json(material);
        }
    },
    async details(req, res){
        const {_id} = req.params;
        const material = await Material.findOne({_id});
        res.json(material);
    },
    async delete(req, res){
        const { _id } = req.params;
        const material = await Material.findByIdAndDelete({_id});
        return res.json(material);
    },
    async update(req, res){
        const {_id, nmMaterial} = req.body;

        const data = {nmMaterial};

        const material = await Material.findOneAndUpdate({_id}, data, {new:true});

        return res.json(material);
    }
}