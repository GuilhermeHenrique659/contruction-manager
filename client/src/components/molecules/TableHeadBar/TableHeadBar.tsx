import styles from './TableHeadBar.module.css';

export function TableHeadBar({ title, count, action }: { title: string; count: number; action?: React.ReactNode }) {
  return (
    <div className={styles.tableHeadBar}>
      <h3>{title}</h3>
      <div className={styles.headActions}>
        {action}
        <span className={styles.count}>{count} item{count === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}
