import { useState } from 'react';
import styles from './Navbar.module.css';
import { Button } from '../../atoms';
import { Logo } from '../../atoms/Logo/Logo';
import { useTheme } from '../../../context/ThemeContext';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand?: string;
  brandHref?: string;
  links?: NavLink[];
  actions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  } | null;
  onLogout?: () => void;
}

export function Navbar({
  brand = 'ESTRUTURA',
  brandHref = '/',
  links = [],
  actions,
  user = null,
  onLogout,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.navbar}>
      <nav className={styles.navContainer} role="navigation" aria-label="Navegação principal">
        <a href={brandHref} className={styles.brand} onClick={closeMenu}>
          <Logo size="md" />
          <div className={styles.brandText}>
            <span className={styles.brandName}>{brand}</span>
            <small className={styles.brandTagline}>SISTEMA DE GESTÃO DE OBRAS</small>
          </div>
        </a>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`} id="nav-links">
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {actions && <div className={styles.actions}>{actions}</div>}

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            title={theme === 'dark' ? 'Tema escuro' : 'Tema claro'}
          >
            <span className={styles.themeKnob}>
              {theme === 'dark' ? '☾' : '☀'}
            </span>
          </button>

          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                {user.avatar && (
                  <img src={user.avatar} alt="" className={styles.avatar} />
                )}
                <span className={styles.userName}>{user.name}</span>
              </div>
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Sair
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.authActions}>
              <Button variant="outline" size="sm" className={styles.loginBtn}>
                Entrar
              </Button>
              <Button variant="primary" size="sm" className={styles.registerBtn}>
                Cadastrar
              </Button>
            </div>
          )}
        </div>

        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="nav-links"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} />
        </button>
      </nav>
    </header>
  );
}