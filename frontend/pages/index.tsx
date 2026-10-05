import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';

export default function HomePage() {
  const [summary, setSummary] = useState({
    students: 0,
    schoolYears: 0,
    payments: 0,
    staff: 0,
    expenses: 0,
    net: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:4000/api/dashboard/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.summary) {
          setSummary(data.summary);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Tableau de bord</p>
          <h1>Gestion Ecole</h1>
        </div>
        <button className="primary-button">Exporter le rapport</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <span>Élèves</span>
          <strong>{summary.students}</strong>
        </div>
        <div className="stat-card purple">
          <span>Années scolaires</span>
          <strong>{summary.schoolYears}</strong>
        </div>
        <div className="stat-card green">
          <span>Recettes</span>
          <strong>{summary.payments.toLocaleString()} FC</strong>
        </div>
        <div className="stat-card orange">
          <span>Dépenses</span>
          <strong>{summary.expenses.toLocaleString()} FC</strong>
        </div>
      </div>

      <div className="card-grid">
        <section className="panel">
          <h2>Solvabilité</h2>
          <div className="ring-row">
            <div className="ring green"><strong>85%</strong><small>À jour</small></div>
            <div className="ring orange"><strong>10%</strong><small>Partiel</small></div>
            <div className="ring red"><strong>5%</strong><small>Retard</small></div>
          </div>
        </section>

        <section className="panel">
          <h2>Activité récente</h2>
          <ul className="stack-list">
            <li>Jean Dupont — paiement reçu : 50 000 FC</li>
            <li>Marie X — facture scolaire mise à jour</li>
            <li>Nouveau supporteur ajouté : GRS</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
