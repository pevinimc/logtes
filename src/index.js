require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express(); // Definindo a variável 'app'
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Conectar ao MongoDB
const mongoURI = process.env.DATABASE_URL;

if (!mongoURI) {
  console.error('A variável DATABASE_URL não está definida no arquivo .env.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB!');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB', err);
});

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Rota de Registro
app.post('/register', async (req, res) => {
  console.log('Body recebido no /register:', req.body); // Log para verificar o corpo da requisição
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Campos obrigatórios faltando.');
  }

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
  console.log('Body recebido no /login:', req.body); // Log para verificar o corpo da requisição
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