import { Layout } from '../components/Layout';

const payments = [
  { id: '1', student: 'Jean Dupont', amount: '50 000 FC', mode: 'Espèces', status: 'Payé' },
  { id: '2', student: 'Marie X', amount: '30 000 FC', mode: 'Versement', status: 'Partiel' },
  { id: '3', student: 'Paul Y', amount: '0 FC', mode: 'Aucun', status: 'Retard' }
];

export default function PaymentsPage() {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Paiements</p>
          <h1>Historique des paiements</h1>
        </div>
        <button className="primary-button">Enregistrer un paiement</button>
      </div>

      <section className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.student}</td>
                <td>{payment.amount}</td>
                <td>{payment.mode}</td>
                <td><span className="status-pill status-paid">{payment.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
