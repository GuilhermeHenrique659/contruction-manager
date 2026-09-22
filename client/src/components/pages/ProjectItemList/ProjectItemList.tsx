import styles from './ProjectItemList.module.css';
import { useProjectItemList } from './useProjectItemList';
import { ProjectItemTable } from '../../organisms/ProjectItemTable/ProjectItemTable';

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

          <ProjectItemTable items={items} />
        </div>
      </main>
    </div>
  );
}
