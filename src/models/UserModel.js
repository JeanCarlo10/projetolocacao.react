const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DataSchema = new mongoose.Schema({
    nomeUsuario: String,
    email: String,
    tipoUsuario: { type: String, default: "Administrador" }, //Administrador e Colaborador
    senha: String,
}, {
    timestamps: true
});

//Quando a senha chegar aqui, antes de salvar. O código já criptografa automaticamente
DataSchema.pre('save', async function () {
    if (!this.isModified("senha")) return;
    this.senha = await bcrypt.hash(this.senha, 10);
});

DataSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    if (update.senha && update.senha.length < 55) {
        update.senha = await bcrypt.hash(update.senha, 10);
        this.setUpdate(update); // garantir que update seja alterado
    }
});

DataSchema.methods.isCorrectPassword = async function (password) {
    try {
        const same = await bcrypt.compare(password, this.senha);
        return same;
    } catch (err) {
        throw err;
    }
};

const users = mongoose.model('users', DataSchema);

module.exports = users;