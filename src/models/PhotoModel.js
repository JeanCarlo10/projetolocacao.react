const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    content: String,
    size: Number,
    name: String,
    type: String
},{
    timestamps: true
});

const Photo = mongoose.model('photo', DataSchema);

module.exports = Photo;