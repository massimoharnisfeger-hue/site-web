import { responsiveSources } from "../../lib/images";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  /** Classes du cadre : ratio, hauteur, rayon. */
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  onError?: () => void;
};

/** Image paresseuse, décodage asynchrone, ratio réservé par le cadre, srcSet Pexels. */
export function Photo({ src, alt, sizes = "100vw", className = "", imgClassName = "", eager = false, onError }: Props) {
  return (
    <div className={`overflow-hidden rounded-[4px] bg-rule ${className}`}>
      <img
        src={src}
        {...responsiveSources(src)}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={onError}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
