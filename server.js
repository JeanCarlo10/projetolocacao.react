const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./src/routes');

const app = express();
const port = process.env.PORT || 5000;

// app.use('./client/public/images', express.static('./client/public/images'));

mongoose.connect('mongodb://localhost:27017/LocacaoDB',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}, function(err){
    if (err){
        console.log(err, 'erro de conexão!')
    }else{
        console.log('MongoDB conectado com sucesso!')
    }
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.listen(port, function(){
    console.log(`Servidor rodando na porta ${port}`)
});