import { Modal } from '../../atoms/Modal/Modal';
import { Badge, CardTag } from '../../atoms/Card/Card';
import { Button } from '../../atoms/Button/Button';
import { IconX } from '../../atoms/Icon/IconX';
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
  const [localItems, setLocalItems] = useState<ProjectItem[]>(items);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
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
          {localItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={styles.noBorderField}>
                <Input defaultValue={item.description || ''} fullWidth />
              </TableCell>
              <TableCell className={styles.noBorderField}>
                <Select options={[{ value: item.category?.id || '', label: item.category?.description || 'Selecione...' }, { value: 'cat1', label: 'Categoria A' }, { value: 'cat2', label: 'Categoria B' }]} defaultValue={item.category?.id || ''} fullWidth />
              </TableCell>
              <TableCell>{item.total ?? 0}</TableCell>
              <TableCell>
                <div className={styles.purchases}>
                  {item.orders?.map((purchase, idx) => (
                    <div className={styles.purchaseRow} key={purchase.id || idx}>
                      <div className={styles.purchaseInfo}>
                        <div className={styles.desc}><CardTag>{purchase.quantity}x</CardTag> <Badge variant="neutral">{purchase.status || '—'}</Badge></div>
                        <div className={styles.detail}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.price)} un. — subtotal {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.price * purchase.quantity)}</div>
                      </div>
                      <Button variant="danger" size="sm" className={styles.removeBtn} aria-label="Remover compra" title="Remover" onClick={() => {
                        const updated = localItems.map(i => i.id === item.id ? { ...i, orders: i.orders.filter((_: any, filterIdx: number) => filterIdx !== idx) } : i);
                        setLocalItems(updated);
                      }}>
                        <IconX size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className={styles.addPurchaseBtn} type="button" onClick={() => { setSelectedItemId(item.id); setPurchaseModalOpen(true); }}>+ Adicionar compra</Button>
                </div>
              </TableCell>
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
      <Modal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} title="Nova compra">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Quantidade" value={qty} onChange={e => setQty(e.target.value)} placeholder="Ex: 2" />
          <Input label="Preço unitário (R$)" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 22.90" />
          <Input label="Status / Descrição" value={status} onChange={e => setStatus(e.target.value)} placeholder="Ex: Pendente" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setPurchaseModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" size="sm" onClick={() => {
              if (!selectedItemId) return;
              const priceNum = parseFloat(price) || 0;
              const qtyNum = parseInt(qty, 10) || 1;
              setLocalItems(localItems.map(i => i.id === selectedItemId ? { ...i, orders: [...i.orders, { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), quantity: qtyNum, price: priceNum, status, purchasedAt: null, vendor: { id: '', name: '', paymentDay: null } }] } : i));
              setPurchaseModalOpen(false);
              setQty('1'); setPrice(''); setStatus('');
            }}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
