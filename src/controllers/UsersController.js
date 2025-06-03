const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res) {
        const keyword = String(req.query.keyword || '');

        const user = await User.find({
            nomeUsuario: { $regex: keyword, $options: "i" }
        });

        res.json(user);
    },

    async create(req, res) {
        const { nomeUsuario, email, tipoUsuario, senha } = req.body;

        try {
            // Verifica se o usuário já existe
            //const existingUser = await User.findOne({ email });

            // if (existingUser) {
            //     return res.status(409).json({ error: 'Usuário já cadastrado com este e-mail.' }); 
            // }

            const user = await User.create({
                nomeUsuario,
                email,
                tipoUsuario,
                senha
            });

            return res.status(200).json(user);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    },

    async details(req, res) {
        try {
            const { _id } = req.params;
            const user = await User.findOne({ _id });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(user);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    async delete(req, res) {
        try {
            const { _id } = req.params;
            const user = await User.findByIdAndDelete(_id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json({ message: 'Usuário removido com sucesso', user });
        } catch (err) {
            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    },

    async update(req, res) {
        try {
            const { _id, nomeUsuario, email, senha, tipoUsuario } = req.body;

            const data = { nomeUsuario, email, senha, tipoUsuario };

            const user = await User.findOneAndUpdate({ _id }, data, { new: true });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json(user);
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const user = await User.findOne({
                email: email,
                tipoUsuario: { $in: ["Administrador", "Colaborador"] }
            });

            if (!user) {
                return res.status(200).json({ status: 2, error: 'Email não encontrado no banco de dados!' });
            }

            const same = await user.isCorrectPassword(senha);

            if (!same) {
                return res.status(200).json({ status: 2, error: "A senha não confere" });
            }

            const payload = { email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax'
            });

            return res.status(200).json({
                status: 1,
                auth: true,
                token,
                id_client: user._id,
                user_name: user.nomeUsuario
            });

        } catch (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ error: 'Erro no servidor. Por favor, tente novamente!' });
        }
    },

    async checkToken(req, res) {
        try {
            const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];

            if (!token) {
                return res.status(401).json({ msg: 'Não autorizado: Token inexistente!' });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ msg: 'Não autorizado: Token inválido!' });
                } else {
                    return res.status(200).json({ status: 200 });
                }
            });
        } catch (err) {
            console.error('Erro ao verificar token:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
    },

    async destroyToken(req, res) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const token = authHeader.split(' ')[1]; // Pega o token depois de "Bearer"

                // Aqui você pode validar, blacklist, etc. Se não for usar mais, pode só limpar cookie/localStorage mesmo.
                res.clearCookie('token', { httpOnly: true }); // opcional
                return res.send("Sessão finalizada com sucesso!");
            } else {
                return res.status(401).send("Logout não autorizado!");
            }
        } catch (err) {
            console.error('Erro ao destruir token:', err);
            return res.status(500).json({ error: 'Erro ao encerrar sessão' });
        }
    }
}
