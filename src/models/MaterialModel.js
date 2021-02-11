const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    nmMaterial: String,
},{
    timestamps: true
});

const materials = mongoose.model('materials', DataSchema);

module.exports = materials;