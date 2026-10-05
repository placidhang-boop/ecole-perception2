import { Layout } from '../components/Layout';

export default function ReportsPage() {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Rapports</p>
          <h1>Rapports financiers</h1>
        </div>
      </div>

      <div className="settings-grid">
        <section className="panel">
          <h2>Recettes</h2>
          <ul className="stack-list">
            <li>Frais scolaires : 540 000 FC</li>
            <li>Frais de fonctionnement : 310 000 FC</li>
            <li>Autres revenus : 120 000 FC</li>
          </ul>
        </section>

        <section className="panel">
          <h2>Dépenses</h2>
          <ul className="stack-list">
            <li>Personnel : 220 000 FC</li>
            <li>Maintenance : 95 000 FC</li>
            <li>Autres charges : 60 000 FC</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
