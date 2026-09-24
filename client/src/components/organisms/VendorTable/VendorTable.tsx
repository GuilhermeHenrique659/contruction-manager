import { useState, useEffect, useRef } from 'react';
import { Vendor } from '../../../features/projects/model/Vendor';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Table } from '../../atoms/Table/Table';
import { TableBody } from '../../atoms/Table/TableBody';
import { TableCell } from '../../atoms/Table/TableCell';
import { TableHead } from '../../atoms/Table/TableHead';
import { TableHeaderCell } from '../../atoms/Table/TableHeaderCell';
import { TableRow } from '../../atoms/Table/TableRow';
import { TableHeadBar } from '../../molecules/TableHeadBar/TableHeadBar';
import { useForm } from '../../../hooks/useForm';
import styles from './VendorTable.module.css';

export function VendorTable({ vendors, onAdd }: { vendors: Vendor[]; onAdd: (input: { name: string; paymentDay: number | null }) => Promise<void> }) {
  const [showAdd, setShowAdd] = useState(false);
  const { values, setField, reset } = useForm({ name: '', paymentDay: '' });
  const [isSaving, setIsSaving] = useState(false);
  const addRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (!showAdd) {
      reset();
    }
  }, [showAdd, reset]);

  const handleSave = async () => {
    if (isSaving) return;
    const day = values.paymentDay.trim() === '' ? null : Number(values.paymentDay);
    setIsSaving(true);
    try {
      await onAdd({ name: values.name, paymentDay: day });
      setShowAdd(false);
    } catch {
      // mantém a linha aberta para o usuário corrigir
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (addRowRef.current && e.relatedTarget instanceof Node && addRowRef.current.contains(e.relatedTarget)) return;
    if (!values.name.trim()) {
      setShowAdd(false);
      return;
    }
    handleSave();
  };

  return (
    <div className={styles.tableWrap}>
      <TableHeadBar title="Fornecedores — Projeto" count={vendors.length} unit="fornecedor" action={
        !showAdd ? (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
            {`+ Adicionar fornecedor`}
          </Button>
        ) : null
      } />
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nome</TableHeaderCell>
            <TableHeaderCell>Dia de pagamento</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className={styles.name}>{vendor.name}</TableCell>
              <TableCell className={styles.paymentDay}>{vendor.paymentDay !== null ? vendor.paymentDay : '—'}</TableCell>
            </TableRow>
          ))}
          {vendors.length === 0 && !showAdd && (
            <TableRow>
              <TableCell colSpan={2} className={styles.empty}>Nenhum fornecedor cadastrado</TableCell>
            </TableRow>
          )}
          {showAdd && (
            <TableRow ref={addRowRef}>
              <TableCell className={styles.noBorderField}>
                <Input placeholder="Nome do fornecedor..." fullWidth value={values.name} onChange={e => setField('name', e.target.value)} onBlur={handleBlur} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }} />
              </TableCell>
              <TableCell className={styles.noBorderField}>
                <Input placeholder="Ex: 15" fullWidth value={values.paymentDay} onChange={e => setField('paymentDay', e.target.value)} onBlur={handleBlur} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
