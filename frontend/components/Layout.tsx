import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export function Layout({ children, hideSidebar = false }: { children: ReactNode; hideSidebar?: boolean }) {
  const router = useRouter();

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className="app-shell">
      {!hideSidebar && (
        <aside className="sidebar">
          <div className="brand">GestionEcole</div>
          <nav>
            <Link href="/">Tableau de bord</Link>
            <Link href="/students">Élèves</Link>
            <Link href="/payments">Paiements</Link>
            <Link href="/reports">Rapports</Link>
            <Link href="/settings">Paramètres</Link>
          </nav>
          <button className="secondary-button" onClick={logout}>Déconnexion</button>
        </aside>
      )}

      <main className="main-content">{children}</main>
    </div>
  );
}
