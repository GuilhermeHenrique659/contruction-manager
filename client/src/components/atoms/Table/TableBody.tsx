import React from 'react';
import styles from './TableBody.module.css';

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className={styles.tbody}>{children}</tbody>;
}
