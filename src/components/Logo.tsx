interface Props {
  size?: number;
}

export default function Logo({ size = 32 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <rect
        x="7"
        y="8"
        width="14"
        height="19"
        rx="2.5"
        fill="#ffffff"
        opacity="0.45"
        transform="rotate(-9 14 17.5)"
      />
      <rect
        x="11"
        y="6"
        width="14"
        height="19"
        rx="2.5"
        fill="#ffffff"
        transform="rotate(7 18 15.5)"
      />
      <g transform="rotate(7 18 15.5)" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round">
        <line x1="14.5" y1="12" x2="22.5" y2="12" />
        <line x1="14.5" y1="16" x2="22.5" y2="16" />
        <line x1="14.5" y1="20" x2="20" y2="20" />
      </g>
    </svg>
  );
}
