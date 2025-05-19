const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    },

    async create(req, res) {
        const { nmUsuario, dsEmail, flUsuario, senha } = req.body;
        try {
            // Verifica se o usuário já existe
            const existingUser = await User.findOne({ dsEmail });

            if (existingUser) {
                return res.status(409).json({ error: 'Usuário já cadastrado com este e-mail.' }); // 409: conflito
            }

            // Criptografa a senha antes de salvar (caso ainda não tenha feito isso no schema)
            const hashedPassword = await bcrypt.hash(senha, 10);

            const user = await User.create({
                nmUsuario,
                dsEmail,
                flUsuario,
                senha: hashedPassword
            });

            return res.status(201).json(user); // 201: criado com sucesso
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
            const { _id, nmUsuario, dsEmail, senha, flUsuario } = req.body;

            const data = { nmUsuario, dsEmail, senha, flUsuario };

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

            const user = await User.findOne({ dsEmail: email, flUsuario: 1 });

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
                user_name: user.nmUsuario
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
            const token = req.headers.token;

            if (token) {
                res.cookie('token', null, { httpOnly: true });
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
