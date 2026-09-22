import React from 'react';
import styles from './TableHead.module.css';

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className={styles.thead}>{children}</thead>;
}
