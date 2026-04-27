import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __dir = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dir, '../data/users.json');

function readUsers() {
  if (!existsSync(DB_PATH)) return [];
  return JSON.parse(readFileSync(DB_PATH, 'utf8'));
}

function writeUsers(users) {
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function sign(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, lang } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });
  if (username.length < 2) return res.status(400).json({ error: '用户名至少 2 个字符' });
  if (password.length < 6) return res.status(400).json({ error: '密码至少 6 位' });

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: '用户名已被使用' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, hash, lang: lang || 'en', createdAt: new Date().toISOString() };
  users.push(user);
  writeUsers(users);

  res.json({ token: sign(user), username: user.username, id: user.id, lang: user.lang });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: '用户名或密码错误' });

  const ok = await bcrypt.compare(password, user.hash);
  if (!ok) return res.status(401).json({ error: '用户名或密码错误' });

  res.json({ token: sign(user), username: user.username, id: user.id, lang: user.lang || 'en' });
});

// GET /api/auth/me  (verify token)
router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: '未登录' });
  try {
    const payload = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
    const users = readUsers();
    const user = users.find(u => u.id === payload.id);
    res.json({ id: payload.id, username: payload.username, lang: user?.lang || 'en' });
  } catch {
    res.status(401).json({ error: 'token 无效或已过期' });
  }
});

export default router;
