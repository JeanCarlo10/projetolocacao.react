const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    flTipo: {
        type: String,
        require: true,
    },
    nrTelefone: {
        type: String,
        require: true,
    },
    dsObservacao: {
        type: String
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }
},{
    timestamps: true
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;