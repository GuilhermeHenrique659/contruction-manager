import { useState, FormEvent } from 'react';
import styles from './CreateProjectDrawer.module.css';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { IconX } from '../../atoms/Icon/IconX';

interface CreateProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateProjectDrawer({ isOpen, onClose, onSubmit, isLoading }: CreateProjectDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome do projeto é obrigatório');
      return;
    }

    try {
      await onSubmit(name, description);
      setName('');
      setDescription('');
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
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Residencial Alpha"
            fullWidth
            required
            autoFocus
            disabled={isLoading}
          />

          <Input
            label="Descrição (opcional)"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
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