import React from 'react';
import styles from './TableHeaderCell.module.css';

export function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return <th className={styles.th}>{children}</th>;
}
