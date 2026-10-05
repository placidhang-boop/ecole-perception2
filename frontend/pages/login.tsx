import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@school.local');
  const [password, setPassword] = useState('Admin@123!');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error || 'Erreur de connexion');
      return;
    }

    const payload = await res.json();
    localStorage.setItem('token', payload.token);
    router.push('/');
  }

  return (
    <Layout hideSidebar>
      <div className="login-shell">
        <form className="panel login-card" onSubmit={onSubmit}>
          <p className="eyebrow">Sécurité</p>
          <h1>Connexion</h1>

          {error && <div className="error-box">{error}</div>}

          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="primary-button full" type="submit">Se connecter</button>
        </form>
      </div>
    </Layout>
  );
}
