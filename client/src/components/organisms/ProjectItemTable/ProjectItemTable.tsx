import { Button } from '../../atoms/Button/Button';
import React, { useState } from 'react';
import { Table } from '../../atoms/Table/Table';
import { TableHead } from '../../atoms/Table/TableHead';
import { TableBody } from '../../atoms/Table/TableBody';
import { TableHeaderCell } from '../../atoms/Table/TableHeaderCell';
import { Select, Input } from '../../atoms/Input/Input';
import { TableHeadBar } from '../../molecules/TableHeadBar/TableHeadBar';
import { TableRow } from '../../atoms/Table/TableRow';
import { TableCell } from '../../atoms/Table/TableCell';
import styles from './ProjectItemTable.module.css';

export interface ProjectItem {
  id: number | string;
  description: string;
  total: number;
  category: { id: string; description: string };
  orders: { id: string; quantity: number; price: number; status: string; purchasedAt: Date | null; vendor: { id: string; name: string; paymentDay: number | null; } }[];
}

export function ProjectItemTable({ items }: { items: ProjectItem[] }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className={styles.tableWrap}>
      <TableHeadBar title="Itens — Projeto" count={items.length} action={
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Ocultar' : '+ Adicionar item'}
        </Button>
      } />
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Descrição</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
            <TableHeaderCell>Compras</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={styles.noBorderField}>
                <Input defaultValue={item.description || ''} fullWidth />
              </TableCell>
              <TableCell className={styles.noBorderField}>
                <Select options={[{ value: item.category?.id || '', label: item.category?.description || 'Selecione...' }, { value: 'cat1', label: 'Categoria A' }, { value: 'cat2', label: 'Categoria B' }]} defaultValue={item.category?.id || ''} fullWidth />
              </TableCell>
              <TableCell>{item.total ?? 0}</TableCell>
              <TableCell>{item.orders?.length ?? 0}</TableCell>
            </TableRow>
          ))}
          {showAdd && (
            <TableRow>
              <TableCell className={styles.noBorderField}>
                <Input placeholder="Novo item..." fullWidth />
              </TableCell>
              <TableCell className={styles.noBorderField}>
                <Select options={[{ value: 'cat1', label: 'Categoria A' }, { value: 'cat2', label: 'Categoria B' }]} fullWidth />
              </TableCell>
              <TableCell>—</TableCell>
              <TableCell>—</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
