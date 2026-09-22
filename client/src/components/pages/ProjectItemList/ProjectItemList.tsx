import styles from './ProjectItemList.module.css';
import { useProjectItemList } from './useProjectItemList';

export function ProjectItemList() {
  const { items, isLoading } = useProjectItemList();

  if (isLoading) return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.section}>
          <p>Carregando...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.section}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>ITENS</span>
              <h1 className={styles.title}>Itens do Projeto</h1>
            </div>
          </header>
          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <input type="text" defaultValue={item.nome} style={{ width: '100%' }} />
                  </td>
                </tr>
              ))}
              <tr>
                <td>-</td>
                <td>
                  <input type="text" placeholder="Novo item..." style={{ width: '100%' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
