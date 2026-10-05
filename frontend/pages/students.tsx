import { Layout } from '../components/Layout';

const students = [
  { id: '1', name: 'Jean Dupont', promotion: '3ème secondaire', category: 'Élève supporté', status: 'À jour', amount: '150 000 FC' },
  { id: '2', name: 'Marie X', promotion: '2ème secondaire', category: 'Enfant d’enseignant', status: 'Partiel', amount: '75 000 FC' },
  { id: '3', name: 'Paul Y', promotion: '1ère secondaire', category: 'Non supporté', status: 'Retard', amount: '0 FC' }
];

export default function StudentsPage() {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Élèves</p>
          <h1>Liste des élèves</h1>
        </div>
        <button className="primary-button">Ajouter un élève</button>
      </div>

      <section className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Promotion</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.promotion}</td>
                <td>{student.category}</td>
                <td><span className="status-pill status-paid">{student.status}</span></td>
                <td>{student.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
