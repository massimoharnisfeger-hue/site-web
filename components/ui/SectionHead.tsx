import Reveal from "@/components/fx/Reveal";

/**
 * En-tête de section commun : repère et titre à gauche, introduction à droite,
 * alignée sur la ligne de base du titre. Empilé sur téléphone.
 */
export default function SectionHead({
  eyebrow,
  title,
  intro,
  aside,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Contenu libre à la place de l'introduction (mention, filtre…). */
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="mb-10 grid gap-3 lg:mb-14 lg:grid-cols-12 lg:items-end lg:gap-14">
      <div className="lg:col-span-5">
        <p className="label text-turf">{eyebrow}</p>
        <h2 id={id} className="h2 mt-3">
          {title}
        </h2>
      </div>
      {intro && <p className="max-w-[34rem] text-[16px] text-muted lg:col-span-7 lg:text-[17px]">{intro}</p>}
      {aside && <div className="lg:col-span-7">{aside}</div>}
    </Reveal>
  );
}
