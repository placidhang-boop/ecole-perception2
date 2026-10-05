import { Layout } from '../components/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Paramètres</p>
          <h1>Configuration</h1>
        </div>
      </div>

      <div className="settings-grid">
        <section className="panel">
          <h2>Types de frais</h2>
          <ul className="stack-list">
            <li>Frais scolaires</li>
            <li>Frais de fonctionnement</li>
            <li>Autres frais</li>
          </ul>
        </section>

        <section className="panel">
          <h2>SMS / notifications</h2>
          <ul className="stack-list">
            <li>SMS activé</li>
            <li>Provider : fournisseur abstrait</li>
            <li>Historique disponible</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
