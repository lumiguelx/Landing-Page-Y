const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const SECRET = process.env.JWT_SECRET || 'segredo123';

// Middleware de autenticação
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.sendStatus(403);
  }
}

// Rotas
app.post('/api/sugestoes', async (req, res) => {
  const { nome, email, texto } = req.body;
  const sugestao = await prisma.sugestao.create({
    data: { nome, email, texto },
  });
  res.json(sugestao);
});

app.get('/api/sugestoes', auth, async (req, res) => {
  const sugestoes = await prisma.sugestao.findMany({ orderBy: { id: 'desc' } });
  res.json(sugestoes);
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  // Verifica se o e-mail existe
  const admin = await prisma.admin.findUnique({ where: { email } });
  
  if (!admin || !(await bcrypt.compare(senha, admin.hash))) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  // Cria o token JWT
  const token = jwt.sign({ id: admin.id }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

app.post('/api/login', async (req, res) => {
  console.log('Requisição de login recebida', req.body); // Para verificar o que está sendo enviado no corpo da requisição

  const { email, senha } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(senha, admin.hash))) {
    console.log('E-mail ou senha inválidos');
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  const token = jwt.sign({ id: admin.id }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});


app.get('/api/tabloide', async (req, res) => {
  const tabloide = await prisma.tabloide.findUnique({ where: { id: 1 } });
  res.json(tabloide);
});
app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
