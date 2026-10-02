// Icônes en SVG en ligne, trait de 1,5 px.
type Props = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export const IconMenu = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconClose = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconPlus = ({ className }: Props) => (
  <svg {...base} width={16} height={16} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconChevronLeft = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconChevronRight = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconMinus = ({ className }: Props) => (
  <svg {...base} width={16} height={16} className={className}>
    <path d="M5 12h14" />
  </svg>
);
