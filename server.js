const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const nodeSchedule = require('node-schedule');
const Rent = require('./src/models/RentModel');
require('dotenv').config();
require('./src/services/updateRentStatusJob');
const app = express();

const port = process.env.PORT_BACK;

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

app.get('/', (req, res) => {
    Rent.find().then((result) => {
        res.send(result);
    });
    
    console.log(result);
});

app.post('/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'Imagem não foi carregada'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'Imagem carregada',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

mongoose.connect(process.env.MONGO_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}, function (err) {
    if (err) {
        console.log(err, 'erro de conexão!')
    } else {
        console.log('MongoDB conectado com sucesso!')
    }
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`)
    // console.log('Teste BACKEND: ' + process.env.API_URL)
});