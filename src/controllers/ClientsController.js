const Client = require('../models/ClientModel');
const path = require('path');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const keyword = req.query.keyword || "";
        const regex = new RegExp(keyword, "i");

        const client = await Client.find({
            $or: [
                { nomeCliente: { $regex: regex } },
                { nomeFantasia: { $regex: regex } },
                { cpf: { $regex: regex } },
                { cnpj: { $regex: regex } }
            ]
        });

        res.json(client);
    },

    async detailsInProducts(req, res) {
        const client = await Client.find();

        res.json(client);
    },

    //ADD CLIENT
    async create(req, res) {
        try {
            const data = req.body

            // Parse dos contatos (se vierem como JSON string)
            if (data.contacts) {
                try {
                    data.contacts = JSON.parse(data.contacts);
                } catch (e) {
                    console.error('Erro ao fazer parse dos contatos:', e);
                    data.contacts = [];
                }
            }

            // Salva a foto se tiver
            if (req.file) {
                data.foto = `/uploads/${req.file.filename}`;
            }

            const client = await Client.create(data);
            await client.save();

            return res.status(200).json(client);
        } catch (err) {
            console.error('Erro ao cadastrar cliente:', err);
            return res.status(500).json({
                error: 'Por favor, contate o administrador! Erro ao cadastrar o cliente.'
            });
        }
    },

    //GET CLIENTS
    async details(req, res) {
        try {
            const { _id } = req.params;
            const client = await Client.findOne({ _id });

            if (!client) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            res.json(client);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    //GET RENTS - OVERVIEW
    async overview(req, res) {
        const { _id } = req.params;

        try {
            const client = await Client.findById(_id);

            if (!client) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            res.json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
    },

    //UPDATE CLIENT
    async update(req, res) {
        try {
            const data = req.body;

            // Parse dos contatos (se vierem como JSON string)
            if (data.contacts) {
                try {
                    data.contacts = JSON.parse(data.contacts);
                } catch (e) {
                    console.error('Erro ao fazer parse dos contatos:', e);
                    data.contacts = [];
                }
            }

            // Se solicitou a remoção da foto
            if (req.file) {
                data.foto = `/uploads/${req.file.filename}`;
            }
            else if (req.body.removePhoto === 'true') {
                const clientCurrent = await Client.findById(req.params._id);

                if (clientCurrent?.foto) {
                    const fotoPath = path.join(__dirname, '..', '..', 'uploads', path.basename(clientCurrent.foto));

                    fs.unlink(fotoPath, (err) => {
                        if (err) {
                            console.error('Erro ao excluir foto antiga:', err);
                        } else {
                            console.log('Foto removida com sucesso:', fotoPath);
                        }
                    });
                }
                data.foto = '';
            }

            // Atualiza o cliente com os dados finais
            const updatedClient = await Client.findByIdAndUpdate(req.params._id, data, { new: true });

            return res.json(updatedClient);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
        }
    }
}