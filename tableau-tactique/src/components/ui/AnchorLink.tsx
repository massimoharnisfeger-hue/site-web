import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToTarget } from "../../lib/scroll";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  /** Ancre de la page d'accueil, par exemple « #offres ». */
  target: string;
  children: ReactNode;
  onNavigate?: () => void;
};

/** Lien d'ancre : défilement fluide sur l'accueil, retour vers `/#section` ailleurs. */
export function AnchorLink({ target, children, onNavigate, ...rest }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (onHome) {
      if (scrollToTarget(target)) event.preventDefault();
    } else {
      event.preventDefault();
      navigate(`/${target}`);
    }
  };

  return (
    <a href={onHome ? target : `/${target}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
