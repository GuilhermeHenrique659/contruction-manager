import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = false }: LogoProps) {
  return (
    <svg
      className={`${styles.logo} ${styles[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width="120"
      height="120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="logoInnerClip">
          <circle cx="60" cy="60" r="45" />
        </clipPath>
      </defs>

      <g>
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--brass-500)" stroke-width="3" />
        <g fill="var(--brass-500)">
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(0 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(30 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(60 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(90 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(120 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(150 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(180 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(210 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(240 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(270 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(300 60 60)" />
          <rect x="56" y="3" width="8" height="11" rx="1" transform="rotate(330 60 60)" />
        </g>
        <g fill="var(--brass-700)">
          <circle cx="60" cy="8" r="2.4" />
          <circle cx="112" cy="60" r="2.4" />
          <circle cx="60" cy="112" r="2.4" />
          <circle cx="8" cy="60" r="2.4" />
        </g>
      </g>

      <circle cx="60" cy="60" r="45" fill="var(--bg-2)" stroke="var(--line-strong)" stroke-width="1.5" />

      <g stroke="var(--brass-700)" stroke-width="1.4" opacity="0.38" clip-path="url(#logoInnerClip)">
        <line x1="68.0" y1="60.0" x2="104.0" y2="60.0" />
        <line x1="67.7" y1="62.1" x2="102.5" y2="71.4" />
        <line x1="66.9" y1="64.0" x2="98.1" y2="82.0" />
        <line x1="65.7" y1="65.7" x2="91.1" y2="91.1" />
        <line x1="64.0" y1="66.9" x2="82.0" y2="98.1" />
        <line x1="62.1" y1="67.7" x2="71.4" y2="102.5" />
        <line x1="60.0" y1="68.0" x2="60.0" y2="104.0" />
        <line x1="57.9" y1="67.7" x2="48.6" y2="102.5" />
        <line x1="56.0" y1="66.9" x2="38.0" y2="98.1" />
        <line x1="54.3" y1="65.7" x2="28.9" y2="91.1" />
        <line x1="53.1" y1="64.0" x2="21.9" y2="82.0" />
        <line x1="52.3" y1="62.1" x2="17.5" y2="71.4" />
        <line x1="52.0" y1="60.0" x2="16.0" y2="60.0" />
        <line x1="52.3" y1="57.9" x2="17.5" y2="48.6" />
        <line x1="53.1" y1="56.0" x2="21.9" y2="38.0" />
        <line x1="54.3" y1="54.3" x2="28.9" y2="28.9" />
        <line x1="56.0" y1="53.1" x2="38.0" y2="21.9" />
        <line x1="57.9" y1="52.3" x2="48.6" y2="17.5" />
        <line x1="60.0" y1="52.0" x2="60.0" y2="16.0" />
        <line x1="62.1" y1="52.3" x2="71.4" y2="17.5" />
        <line x1="64.0" y1="53.1" x2="82.0" y2="21.9" />
        <line x1="65.7" y1="54.3" x2="91.1" y2="28.9" />
        <line x1="66.9" y1="56.0" x2="98.1" y2="38.0" />
        <line x1="67.7" y1="57.9" x2="102.5" y2="48.6" />
      </g>

      <g clip-path="url(#logoInnerClip)">
        <g fill="var(--brass-500)">
          <rect x="44" y="90" width="32" height="8" />
          <rect x="47" y="79" width="26" height="11" />
          <rect x="50" y="38" width="20" height="41" />
          <rect x="52" y="30" width="16" height="8" />
          <rect x="55" y="24" width="10" height="6" />
          <rect x="59" y="16" width="2" height="8" />
          <circle cx="60" cy="16" r="1.6" />
        </g>
        <g stroke="var(--bg-1)" stroke-width="1">
          <line x1="54" y1="39" x2="54" y2="78" />
          <line x1="57.3" y1="39" x2="57.3" y2="78" />
          <line x1="60.5" y1="39" x2="60.5" y2="78" />
          <line x1="63.7" y1="39" x2="63.7" y2="78" />
          <line x1="67" y1="39" x2="67" y2="78" />
          <line x1="50.5" y1="80" x2="50.5" y2="89" />
          <line x1="55.5" y1="80" x2="55.5" y2="89" />
          <line x1="60.5" y1="80" x2="60.5" y2="89" />
          <line x1="65.5" y1="80" x2="65.5" y2="89" />
          <line x1="70.5" y1="80" x2="70.5" y2="89" />
        </g>
        <g stroke="var(--bg-1)" stroke-width="1.2" opacity="0.7">
          <line x1="47" y1="79" x2="73" y2="79" />
          <line x1="50" y1="38" x2="70" y2="38" />
          <line x1="52" y1="30" x2="68" y2="30" />
          <line x1="55" y1="24" x2="65" y2="24" />
        </g>
      </g>

      {showText && (
        <text
          x="60"
          y="130"
          className={styles.logoText}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="16"
          fill="var(--ink-0)"
        >
          ESTRUTURA
        </text>
      )}
    </svg>
  );
}