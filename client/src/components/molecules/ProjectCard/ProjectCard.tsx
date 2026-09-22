import styles from './ProjectCard.module.css';
import { Project } from '../../../features/projects/model/ProjectModel';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}/itens`} className={styles.link}>
      <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
      </div>
      <p className={styles.description}>{project.description || 'Sem descrição'}</p>
    </article>
    </Link>
  );
}