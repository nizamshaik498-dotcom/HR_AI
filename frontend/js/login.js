let mode = 'login';

const $ = (id) => document.getElementById(id);

function setMode(m) {
  mode = m;
  const isRegister = mode === 'register';
  $('authTitle').textContent = isRegister ? 'Create account' : 'Welcome back';
  $('authSubtitle').textContent = isRegister ? 'Start practicing interviews in minutes' : 'Sign in to continue your interview practice';
  $('nameGroup').style.display = isRegister ? 'block' : 'none';
  $('name').required = isRegister;
  $('submitBtn').textContent = isRegister ? 'Create Account' : 'Sign In';
  $('togglePrompt').textContent = isRegister ? 'Already have an account? ' : 'New here? ';
  $('toggle').textContent = isRegister ? 'Sign In' : 'Create an account';
  clearErrors();
  $('msg').style.display = 'none';
}

function clearErrors() {
  ['name', 'email', 'password'].forEach(id => {
    const el = $(id);
    const err = $(id + 'Error');
    if (el) el.classList.remove('input-error');
    if (err) err.textContent = '';
  });
}

function showError(field, message) {
  const el = $(field);
  const err = $(field + 'Error');
  if (el) el.classList.add('input-error');
  if (err) err.textContent = message;
}

$('toggle').onclick = (e) => {
  e.preventDefault();
  setMode(mode === 'login' ? 'register' : 'login');
};

$('authForm').onsubmit = async (e) => {
  e.preventDefault();
  clearErrors();

  const body = {
    email: $('email').value.trim(),
    password: $('password').value
  };

  if (mode === 'register') {
    body.name = $('name').value.trim();
    if (!body.name) { showError('name', 'Name is required'); return; }
    if (body.name.length < 2) { showError('name', 'Name must be at least 2 characters'); return; }
  }

  if (!body.email) { showError('email', 'Email is required'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) { showError('email', 'Invalid email format'); return; }
  if (!body.password) { showError('password', 'Password is required'); return; }
  if (body.password.length < 6) { showError('password', 'Password must be at least 6 characters'); return; }

  const btn = $('submitBtn');
  btn.disabled = true;
  btn.textContent = mode === 'register' ? 'Creating account…' : 'Signing in…';

  try {
    const d = await API.req('/auth/' + mode, { method: 'POST', body });
    localStorage.setItem('token', d.token);
    localStorage.setItem('name', d.name);
    location.href = '/dashboard.html';
  } catch (err) {
    if (err.message.includes('Email')) showError('email', err.message);
    else if (err.message.includes('password') || err.message.includes('Password')) showError('password', err.message);
    else $('msg').textContent = err.message;
    $('msg').style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = mode === 'register' ? 'Create Account' : 'Sign In';
  }
};

setMode('login');