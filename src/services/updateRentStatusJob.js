const Rent = require('../models/RentModel');
const nodeSchedule = require('node-schedule');

async function updateToExpired() {
    const items = await Rent.find({ status: 'Entregue', dataDevolucao: {$lt: new Date()} }).exec();

    items.forEach(element => {
        element.status = 'Não Devolvido';
        element.save();
    });
}

//Executa todos os dias as 09:00 AM
const job = nodeSchedule.scheduleJob('0 0 9 * * *', async (req, res) => {
    updateToExpired();

    console.log('Verificando qual pedido não foi devolvido');
})
