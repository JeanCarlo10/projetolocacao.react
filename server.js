const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const nodeSchedule = require('node-schedule');
const Rent = require('./src/models/RentModel');

const app = express();
const port = process.env.PORT || 5000;

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

const dataHoje = new Date().toLocaleDateString('pt-br');
const job = nodeSchedule.scheduleJob('42 17 * * *', async (req, res) => {
    // const model = req.body;
    app.get('/', (req, res) => {
        Rent.find().then((result) => {
            res.send(result);
        });
        
        console.log(result);
    });
    
    // req.query.status = "Não Devolvido";
    // const rent = await Rent.findOneAndUpdate(model, { new: true });

    console.log('Tarefa agendada está funcionado');
    job.cancel();

    return res.json(rent);
})

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

mongoose.connect('mongodb://localhost:27017/LocacaoDB', {
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
});