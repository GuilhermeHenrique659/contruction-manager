import styles from './Home.module.css';
import { Navbar } from '../../organisms/Navbar';

export function Home() {
  return (
    <div className={styles.page}>
      <Navbar
        brand="ESTRUTURA"
        links={[
          { label: 'Obras', href: '/obras' },
          { label: 'Compras', href: '/compras' },
          { label: 'Gastos', href: '/gastos' },
          { label: 'Fornecedores', href: '/fornecedores' },
          { label: 'Relatórios', href: '/relatorios' },
        ]}
      />
      <main className={styles.main}>
        <section className={styles.intro} aria-label="Introdução">
          <span className={styles.eyebrow}>PAINEL DE CONTROLE</span>
          <h1 className={styles.title}>Constructor Manager</h1>
          <p className={styles.subtitle}>
            Gerencie suas obras, controle gastos e compras em um só lugar.
          </p>
        </section>
      </main>
    </div>
  );
}