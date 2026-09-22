import React from 'react';
import styles from './TableRow.module.css';

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className={styles.tr}>{children}</tr>;
}
