#!/usr/bin/env bash
# Contrôle de l'école : l'état des agents et de leur formation.
# Il ne promeut personne — promouvoir demande de juger des retours, et ça, un
# script ne le fait pas. Il constate ce qui est vérifiable.
#
#   bash .claude/skills/formateur/scripts/controle-promotion.sh [racine]

set -uo pipefail
cd "${1:-.}" 2>/dev/null || { echo "Dossier introuvable"; exit 2; }
FICHES=".claude/agents"; DOSSIERS=".claude/formation"

if [ -t 1 ]; then R=$'\e[31m'; V=$'\e[32m'; J=$'\e[33m'; G=$'\e[1m'; Z=$'\e[0m'
else R=""; V=""; J=""; G=""; Z=""; fi
ECHECS=0; ALERTES=0
echec()  { printf '            %sÉCHEC%s   %s\n' "$R" "$Z" "$1"; ECHECS=$((ECHECS+1)); }
alerte() { printf '            %sALERTE%s  %s\n' "$J" "$Z" "$1"; ALERTES=$((ALERTES+1)); }
ok()     { printf '            %sOK%s      %s\n' "$V" "$Z" "$1"; }

printf '%sCONTRÔLE DE PROMOTION%s — %s\n' "$G" "$Z" "$(pwd)"

[ -d "$FICHES" ] || { echo; echo "  Aucun dossier $FICHES — aucun agent."; exit 0; }

n=0
for f in "$FICHES"/*.md; do
  [ -e "$f" ] || break
  n=$((n+1))
  prenom=$(basename "$f" .md)
  d="$DOSSIERS/$prenom"
  printf '\n  %s%s%s\n' "$G" "$prenom" "$Z"

  # --- la fiche ---
  grep -qE '^tools:' "$f" && ok "outils déclarés : $(grep -m1 '^tools:' "$f" | cut -c8-60)" \
                          || alerte "aucune ligne « tools: » — l'agent reçoit tout, c'est trop"
  grep -qiE '^description:.*\(' "$f" || alerte "la description ne porte pas « Prénom (fonction) »"

  # --- le dossier ---
  if [ ! -d "$d" ]; then
    echec "aucun dossier de formation ($d) — agent jamais instruit"
    continue
  fi
  manquants=""
  for fic in CLAUDE.md ETAT.md memory.md evolution.md verify.md skill.md; do
    [ -f "$d/$fic" ] || manquants="$manquants $fic"
  done
  [ -z "$manquants" ] && ok "dossier complet" || echec "dossier incomplet :$manquants"

  # --- les épreuves ---
  if [ -f "$d/verify.md" ]; then
    passees=$(grep -cE '^\| *[123] *\|.*\|.*\|.*[0-9]{4}-[0-9]{2}-[0-9]{2}' "$d/verify.md" 2>/dev/null || true)
    passees=${passees:-0}
    if [ "$passees" -ge 3 ]; then ok "3 épreuves d'entrée passées"
    else echec "$passees/3 épreuves d'entrée passées — pas encore en service"; fi
  fi

  # --- le niveau contre les faits ---
  if [ -f "$d/ETAT.md" ]; then
    niv=$(grep -iE '^\*\*Niveau' "$d/ETAT.md" | head -1 | grep -oiE 'apprenti|qualifi|de confiance' | head -1)
    util=$(grep -iE '^\*\*Délégations utiles' "$d/ETAT.md" | grep -oE '[0-9]+' | head -1); util=${util:-0}
    grav=$(grep -iE 'Erreurs graves' "$d/ETAT.md" | grep -oE '[0-9]+' | tail -1); grav=${grav:-0}
    case "$(printf '%s' "$niv" | tr 'A-Z' 'a-z')" in
      qualifi*)     [ "$util" -ge 5 ]  && ok "qualifié : $util délégations utiles"      || echec "se dit qualifié avec $util délégation(s) utile(s) — il en faut 5" ;;
      "de confiance") [ "$util" -ge 15 ] && ok "de confiance : $util délégations utiles" || echec "se dit de confiance avec $util délégation(s) utile(s) — il en faut 15" ;;
      apprenti)     ok "apprenti — on vérifie tout ce qu'il rend" ;;
      *)            alerte "aucun niveau déclaré dans ETAT.md" ;;
    esac
    [ "$grav" -gt 0 ] && alerte "$grav erreur(s) grave(s) déclarée(s) — le niveau a-t-il été redescendu ?"

    # --- dormant ---
    der=$(grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' "$d/ETAT.md" | sort | tail -1)
    if [ -n "$der" ]; then
      s=$(date -d "$der" +%s 2>/dev/null) || s=$(date -j -f %Y-%m-%d "$der" +%s 2>/dev/null) || s=""
      [ -n "$s" ] && [ $(( ( $(date +%s) - s ) / 86400 )) -gt 60 ] \
        && alerte "aucune trace depuis plus de 60 jours — candidat au congé"
    fi
  fi

  # --- la règle des trois ---
  if [ -f "$d/skill.md" ]; then
    roles=0
    for r in Domaine Méthode "Garde-fou"; do
      grep -qiE "^\| *\*\*$r\*\* *\|[^|]*[A-Za-z0-9\`]" "$d/skill.md" && roles=$((roles+1))
    done
    case "$roles" in
      3) ok "trois skills, un par rôle" ;;
      0) alerte "aucun skill declaré — l'agent travaille à mains nues" ;;
      *) echec "$roles skill(s) sur 3 — il manque un rôle (domaine · méthode · garde-fou)" ;;
    esac
  fi

  # --- la réflexion ---
  if [ -f "$d/evolution.md" ] && [ "${util:-0}" -ge 5 ]; then
    grep -qE '[0-9]{4}-[0-9]{2}-[0-9]{2}' "$d/evolution.md" \
      && ok "evolution.md porte au moins une séance datée" \
      || alerte "$util délégations et aucune séance de réflexion datée dans evolution.md"
  fi
done

# --- dossiers orphelins ---
if [ -d "$DOSSIERS" ]; then
  for d in "$DOSSIERS"/*/; do
    [ -e "$d" ] || break
    p=$(basename "$d"); [ "$p" = "_archives" ] && continue
    [ -f "$FICHES/$p.md" ] || { printf '\n  %s%s%s\n' "$G" "$p" "$Z"; alerte "dossier de formation sans fiche dans $FICHES — agent fantôme"; }
  done
fi

printf '\n%s────────────────────────────────%s\n' "$G" "$Z"
printf '%d agent(s) · ' "$n"
if [ "$ECHECS" -gt 0 ]; then
  printf '%s%d point(s) bloquant(s)%s, %d alerte(s)\n' "$R" "$ECHECS" "$Z" "$ALERTES"
  printf 'Un agent en échec ne se délègue pas : on finit sa formation d'"'"'abord.\n'
  exit 1
fi
printf '%s0 bloquant%s, %d alerte(s)\n' "$V" "$Z" "$ALERTES"
exit 0
