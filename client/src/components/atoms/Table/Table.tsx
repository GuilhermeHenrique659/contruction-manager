import React from 'react';
import styles from './Table.module.css';

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <table className={`${styles.table} ${className}`}>{children}</table>;
}
