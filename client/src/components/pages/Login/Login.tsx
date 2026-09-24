import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Logo } from '../../atoms/Logo/Logo';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';

import type { FormEvent } from 'react';

export function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading: authIsLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const { values, setField } = useForm({ email: '', name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(values.email, values.name);
      } else {
        await login(values.email);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(prev => !prev);
    setError('');
    setField('name', '');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Logo size="lg" />
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isRegister ? 'Criar conta' : 'Entrar'}
          </h1>
          <p className={styles.subtitle}>
            {isRegister
              ? 'Preencha os dados para criar sua conta'
              : 'Digite seu email para acessar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={e => setField('email', e.target.value)}
            placeholder="seu@email.com"
            fullWidth
            autoComplete="email"
            autoFocus
          />

          {isRegister && (
            <Input
              label="Nome"
              type="text"
              value={values.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="Seu nome completo"
              fullWidth
              autoComplete="name"
            />
          )}

          {error && <div className={styles.error} role="alert">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading || authIsLoading}
            className={styles.submitBtn}
          >
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </Button>
        </form>

        <div className={styles.toggle}>
          <span>{isRegister ? 'Já tem conta?' : 'Não tem conta?'}</span>
          <button type="button" onClick={toggleMode} className={styles.toggleBtn}>
            {isRegister ? 'Entrar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
}