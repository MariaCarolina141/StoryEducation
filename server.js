const express = require("express");
const path = require("path");
const cors = require("cors");
const OpenAI = require("openai");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = path.join(__dirname, "Public");
app.use(express.static(publicPath));


let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (e) {
    console.warn('OpenAI client init failed:', e && e.message);
    openai = null;
  }
} else {
  console.warn('OPENAI_API_KEY not set — AI endpoint will be unavailable.');
}


// Simple in-memory session store for admin tokens
const sessions = {};


function generateToken() {
  return require('crypto').randomBytes(24).toString('hex');
}


app.post("/api/ai", async (req, res) => {
  const { question } = req.body || {};
  if (!question || !question.toString().trim()) {
    return res.status(400).json({ error: "Pergunta obrigatória." });
  }
  if (!openai) {
    return res.status(503).json({ error: 'Serviço de IA indisponível no momento.' });
  }


  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente de negócios útil para pequenos empreendedores no Brasil." },
        { role: "user", content: question }
      ],
      max_tokens: 250,
      temperature: 0.8
    });


    const answer = completion?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return res.status(500).json({ error: "Não foi possível gerar a resposta." });
    }


    return res.json({ answer });
  } catch (error) {
    console.error("Erro de IA:", error);
    return res.status(500).json({ error: "Erro ao acessar o serviço de IA." });
  }
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});


app.get('/api/status', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
});


app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});


// Login endpoint: checks admin password and returns token when admin
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email obrigatório' });
  // If password matches ADMIN_PASSWORD -> create admin token
  if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    const token = generateToken();
    sessions[token] = { admin: true, created: Date.now(), expires: Date.now() + 1000 * 60 * 60 };
    return res.json({ ok: true, admin: true, token });
  }
  // Non-admin accepted as regular user (no token)
  return res.json({ ok: true, admin: false });
});


app.get('/api/verify', (req, res) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ ok: false });
  const token = auth.slice('Bearer '.length);
  const s = sessions[token];
  if (!s || s.expires < Date.now()) return res.status(401).json({ ok: false });
  return res.json({ ok: true, admin: !!s.admin });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, interest, institution_type, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }
  console.log('Contato recebido:', { name, email, interest, institution_type, message, created_at: new Date().toISOString() });
  return res.json({ ok: true, message: 'Contato recebido com sucesso.' });
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { nome, email, senha, fase } = req.body || {};
  if (!nome || !email || !senha || !fase) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  console.log('Cadastro recebido:', { nome, email, fase, created_at: new Date().toISOString() });
  return res.json({ ok: true, message: 'Cadastro realizado com sucesso.' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


