import type { ReactNode } from "react";

type Props = {
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

/** Section : 88 px d'espace vertical (120 px dès 1024 px), filet rule au-dessus. */
export function Section({ id, labelledBy, className = "", children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`border-t border-rule ${className}`}>
      <div className="container-site py-[88px] lg:py-[120px]">{children}</div>
    </section>
  );
}
