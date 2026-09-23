import React from 'react';
import styles from './TableCell.module.css';

export function TableCell({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td className={`${styles.td} ${className}`} colSpan={colSpan}>{children}</td>;
}
