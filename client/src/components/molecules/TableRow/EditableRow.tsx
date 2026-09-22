import { TableCell } from '../../atoms/Table/TableCell';
import { TableRow } from '../../atoms/Table/TableRow';
import { Select } from '../../atoms/Input/Input';
import styles from './EditableRow.module.css';

export function EditableRow({ id, description, total, category, orders }: { id: number | string; description: string; total: number; category: { id: string; description: string }; orders: { id: string; quantity: number; price: number; status: string; purchasedAt: Date | null; vendor: { id: string; name: string; paymentDay: number | null; } }[] }) {
  return (
    <TableRow>
      <TableCell>
        <span className={styles.itemName} contentEditable suppressContentEditableWarning>
          {description || ''}
        </span>
      </TableCell>
      <TableCell>
        <Select options={[{ value: category?.id || '', label: category?.description || 'Selecione...' }, { value: 'cat1', label: 'Categoria A' }, { value: 'cat2', label: 'Categoria B' }]} defaultValue={category?.id || ''} />
      </TableCell>
      <TableCell>{total ?? 0}</TableCell>
      <TableCell>{orders?.length ?? 0}</TableCell>
    </TableRow>
  );
}
