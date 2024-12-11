const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Conectar ao MongoDB (substitua pela sua string de conexão)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Modelo de Usuário
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Rota de Registro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Campos obrigatórios faltando.');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).send('Usuário registrado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao registrar usuário.');
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Campos obrigatórios faltando.');
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).send('Usuário não encontrado.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send('Senha incorreta.');
    }

    res.status(200).send('Login bem-sucedido!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
