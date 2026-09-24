import { useState } from 'react';
import styles from './CreateProjectDrawer.module.css';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { IconX } from '../../atoms/Icon/IconX';
import { useForm } from '../../../hooks/useForm';

import type { FormEvent } from 'react';

interface CreateProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateProjectDrawer({ isOpen, onClose, onSubmit, isLoading }: CreateProjectDrawerProps) {
  const { values, setField, reset } = useForm({ name: '', description: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(values.name, values.description);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className={styles.drawer}>
        <header className={styles.header}>
          <h2 id="drawer-title" className={styles.title}>Novo Projeto</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
            disabled={isLoading}
          >
            <IconX size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Nome do projeto"
            type="text"
            value={values.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="Ex: Residencial Alpha"
            fullWidth
            required
            autoFocus
            disabled={isLoading}
          />

          <Input
            label="Descrição (opcional)"
            type="text"
            value={values.description}
            onChange={e => setField('description', e.target.value)}
            placeholder="Detalhes do projeto..."
            fullWidth
            disabled={isLoading}
          />

          {error && <div className={styles.error} role="alert">{error}</div>}

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Criar projeto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}