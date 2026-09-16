import styles from './ProjectCard.module.css';
import { Project } from '../../../features/projects/model/ProjectModel';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
      </div>
      <p className={styles.description}>{project.description || 'Sem descrição'}</p>
    </article>
  );
}