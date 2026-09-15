#!/usr/bin/env bash
# Constate le rangement et le nommage des projets d'un dossier.
# Il ne renomme rien et ne propose aucun nom : nommer demande de savoir ce que
# fait le projet. Voir conventions/nommage.md pour le rituel.
#
#   bash ranger-projets.sh                  # le dossier courant
#   bash ranger-projets.sh ~/Projects
#   bash ranger-projets.sh "/c/Users/massi/OneDrive/Bureau"

set -uo pipefail
CIBLE="${1:-.}"
cd "$CIBLE" 2>/dev/null || { echo "Dossier introuvable : $CIBLE"; exit 2; }

if [ -t 1 ]; then R=$'\e[31m'; V=$'\e[32m'; J=$'\e[33m'; G=$'\e[1m'; Z=$'\e[0m'
else R=""; V=""; J=""; G=""; Z=""; fi
PB=0

printf '%sRANGEMENT DES PROJETS%s — %s\n\n' "$G" "$Z" "$(pwd)"

# Sommes-nous dans OneDrive ?
case "$(pwd)" in *[Oo]ne[Dd]rive*) DANS_ONEDRIVE=1 ;; *) DANS_ONEDRIVE=0 ;; esac

for d in */; do
  nom="${d%/}"
  [ "$nom" = "*" ] && { echo "  (aucun dossier ici)"; break; }
  ennuis=()

  # --- le nom ---
  printf '%s' "$nom" | LC_ALL=C grep -q '[^a-z0-9-]' && {
    case "$nom" in
      *[A-Z]*) ennuis+=("majuscules") ;;
    esac
    case "$nom" in
      *" "*) ennuis+=("espaces") ;;
    esac
    printf '%s' "$nom" | LC_ALL=C grep -qP '[^\x00-\x7F]' 2>/dev/null && ennuis+=("accents")
    printf '%s' "$nom" | grep -q '_' && ennuis+=("tirets bas — préférer le tiret")
  }
  printf '%s' "$nom" | grep -qiE '(^|[-_ ])(v[0-9]+|final|ok|new|nouveau|test|copie|copy|bis)([-_ ]|$)' \
    && ennuis+=("porte une version ou un état dans le nom")
  printf '%s' "$nom" | grep -qE '(19|20)[0-9]{2}' && ennuis+=("porte une date")
  printf '%s' "$nom" | grep -qiE '^(projet|project|site|web|dossier|travail|work|temp|tmp|divers|misc)([-_].*)?$' \
    && ennuis+=("nom générique — ne dira rien dans six mois")

  # --- l'emplacement ---
  code=0
  for marqueur in package.json .git go.mod Cargo.toml pyproject.toml composer.json; do
    [ -e "$nom/$marqueur" ] && code=1 && break
  done
  [ "$code" = 1 ] && [ "$DANS_ONEDRIVE" = 1 ] \
    && ennuis+=("PROJET DE CODE DANS ONEDRIVE — builds et synchro se gênent")
  [ -d "$nom/node_modules" ] && [ "$DANS_ONEDRIVE" = 1 ] \
    && ennuis+=("node_modules synchronisé — des dizaines de milliers de fichiers")

  # --- les clés ---
  for env in "$nom/.env" "$nom/.env.local" "$nom/secret.env" "$nom/.env.production"; do
    [ -f "$env" ] || continue
    [ "$DANS_ONEDRIVE" = 1 ] && ennuis+=("CLÉS DANS ONEDRIVE : $(basename "$env") — synchronisées dans le cloud")
    if [ -d "$nom/.git" ]; then
      (cd "$nom" && git check-ignore -q "$(basename "$env")" 2>/dev/null) \
        || ennuis+=("$(basename "$env") n'est pas ignoré par git")
    fi
  done

  if [ ${#ennuis[@]} -eq 0 ]; then
    printf '  %sOK%s      %s\n' "$V" "$Z" "$nom"
  else
    printf '  %sÀ VOIR%s  %s\n' "$J" "$Z" "$nom"
    for e in "${ennuis[@]}"; do
      case "$e" in
        *ONEDRIVE*|*"pas ignoré"*) printf '            %s%s%s\n' "$R" "$e" "$Z"; PB=$((PB+1)) ;;
        *) printf '            %s\n' "$e" ;;
      esac
    done
  fi
done

printf '\n%s────────────────────────────────%s\n' "$G" "$Z"
if [ "$PB" -gt 0 ]; then
  printf '%s%d point(s) sérieux%s — code ou clés au mauvais endroit.\n' "$R" "$PB" "$Z"
  printf 'Les noms, eux, se proposent à la lecture : ce script ne nomme pas.\n'
  exit 1
fi
printf '%sRien de sérieux.%s Les noms « à voir » se retravaillent avec le rituel\n' "$V" "$Z"
printf 'de conventions/nommage.md — proposition, puis accord, jamais en silence.\n'
