import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  onClick,
}: CardProps) {
  const classNames = [
    styles.plate,
    styles.riveted,
    styles.card,
    styles[padding],
    hoverable ? styles.hoverable : '',
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span className={styles['rv-bl']} />
      <span className={styles['rv-br']} />
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}

export interface CardTagProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTag({ children, className = '' }: CardTagProps) {
  return <span className={`${styles.cardTag} ${className}`}>{children}</span>;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>;
}

export interface CardTextProps {
  children: React.ReactNode;
  className?: string;
}

export function CardText({ children, className = '' }: CardTextProps) {
  return <p className={`${styles.cardText} ${className}`}>{children}</p>;
}

export interface CardMetaProps {
  children: React.ReactNode;
  className?: string;
}

export function CardMeta({ children, className = '' }: CardMetaProps) {
  return <div className={`${styles.cardMeta} ${className}`}>{children}</div>;
}

export interface ProgressProps {
  value: number;
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

export function Progress({ value, variant = 'default', className = '' }: ProgressProps) {
  const progressStyle: React.CSSProperties = {
    width: `${Math.max(0, Math.min(100, value))}%`,
  };

  if (variant === 'warning') {
    progressStyle.background = 'linear-gradient(90deg, var(--signal-400), var(--rust-500))';
  } else if (variant === 'danger') {
    progressStyle.background = 'var(--rust-500)';
  }

  return (
    <div className={`${styles.progress} ${className}`}>
      <span style={progressStyle} />
    </div>
  );
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ok' | 'warn' | 'danger' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantClass = {
    ok: styles.badgeOk,
    warn: styles.badgeWarn,
    danger: styles.badgeDanger,
    neutral: styles.badgeNeutral,
  }[variant];

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}