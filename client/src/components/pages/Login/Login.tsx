import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Logo } from '../../atoms/Logo/Logo';
import { useAuth } from '../../../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading: authIsLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Nome é obrigatório');
          setIsLoading(false);
          return;
        }
        await register(email, name);
        navigate('/');
      } else {
        await login(email);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(prev => !prev);
    setError('');
    setName('');
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
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            fullWidth
            required
            autoComplete="email"
            autoFocus
          />

          {isRegister && (
            <Input
              label="Nome"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo"
              fullWidth
              required
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