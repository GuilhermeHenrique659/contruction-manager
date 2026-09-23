import styles from './TableHeadBar.module.css';

export function TableHeadBar({ title, count, action, unit = 'item' }: { title: string; count: number; action?: React.ReactNode; unit?: string }) {
  return (
    <div className={styles.tableHeadBar}>
      <h3>{title}</h3>
      <div className={styles.headActions}>
        {action}
        <span className={styles.count}>{count} {unit}{count === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}
