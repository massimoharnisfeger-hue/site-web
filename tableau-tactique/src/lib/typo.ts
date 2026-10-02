// Typographie française à l'affichage : espace insécable avant ? ! : ; et à l'intérieur des « ».
const NBSP = " ";

export function fr(text: string): string {
  return text.replace(/ ([?!:;»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
}

/** Entoure un texte de guillemets français, avec les insécables. */
export function quote(text: string): string {
  return `«${NBSP}${fr(text)}${NBSP}»`;
}
