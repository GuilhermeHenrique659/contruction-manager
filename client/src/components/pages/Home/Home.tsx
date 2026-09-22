import { useState } from 'react';
import styles from './Home.module.css';
import { ProjectCard } from '../../molecules/ProjectCard';
import { CreateProjectDrawer } from '../../organisms/CreateProjectDrawer';
import { Button } from '../../atoms/Button/Button';
import { IconPlus } from '../../atoms/Icon/IconPlus';
import { useProjects } from '../../../hooks/useProjects';

export function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { projects, isLoading, isCreating, createProject } = useProjects();

  const handleCreateProject = async (name: string, description: string) => {
    await createProject({ name, description });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.section}>
          <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>PAINEL DE CONTROLE</span>
            <h1 className={styles.title}>Projetos</h1>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsDrawerOpen(true)}
            isLoading={isCreating}
            className={styles.createBtn}
          >
            <IconPlus size={18} />
            Novo Projeto
          </Button>
          </header>

        <div className={styles.projectsSection}>
          {isLoading ? (
            <div className={styles.loading} role="status" aria-label="Carregando projetos">
              <div className={styles.spinner} aria-hidden="true" />
              <p>Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Nenhum projeto cadastrado</p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsDrawerOpen(true)}
              >
                <IconPlus size={18} />
                Criar primeiro projeto
              </Button>
            </div>
          ) : (
            <div className={styles.grid} role="list">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <CreateProjectDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSubmit={handleCreateProject}
          isLoading={isCreating}
        />
        </div>
      </main>
    </div>
  );
}