import React from 'react';
import styles from './TableCell.module.css';

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`${styles.td} ${className}`}>{children}</td>;
}
