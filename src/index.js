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
