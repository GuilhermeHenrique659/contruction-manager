import React from 'react';
import styles from './TableRow.module.css';

export const TableRow = React.forwardRef<HTMLTableRowElement, { children: React.ReactNode }>(function TableRow({ children }, ref) {
  return <tr ref={ref} className={styles.tr}>{children}</tr>;
});
