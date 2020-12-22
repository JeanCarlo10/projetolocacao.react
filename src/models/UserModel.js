const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DataSchema = new mongoose.Schema({
    nmUsuario:String,
    dsEmail:String,
    flUsuario:{type: Number, default: 1},
    senha:String,
},{
    timestamps: true
});

//Quando a senha chegar aqui, antes de salvar. O código já criptografa automaticamente
DataSchema.pre('save', function(next){
    if(!this.isModified("senha")){
        return next();
    }
    this.senha = bcrypt.hashSync(this.senha, 10);
    next();
});

DataSchema.pre('findOneAndUpdate', function (next){
    var password = this.getUpdate().senha+'';
    if (password.length < 55){
        this.getUpdate().senha = bcrypt.hashSync(password, 10);
    }
    next();
})

DataSchema.methods.isCorrectPassword = function (password, callback){
    bcrypt.compare(password, this.senha, function(err, same){
        if (err){
            callback(err);
        }else{
            callback(err, same);
        }
    })
}

const users = mongoose.model('users', DataSchema);

module.exports = users;