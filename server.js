const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const path = require('path');
require('dotenv').config();
require('./src/services/updateRentStatusJob');

const app = express();
const port = process.env.PORT_BACK || 500;

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com o MongoDB
async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_LOCAL);
    console.log('MongoDB conectado com sucesso!');

  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err);
  }
}
conectarMongo();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    // console.log("Requisição com Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(routes);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});