#!/usr/bin/env bash
# Contrôle de cadre — prouve que le PILOTAGE ne ment pas.
# (Que le produit marche, c'est verify.md. Deux questions différentes.)
#
#   bash .claude/skills/cadre-projet/scripts/controle-cadre.sh [dossier]
#
# Sortie : 0 si tout passe, 1 si au moins un point est en ÉCHEC.
# Les ALERTES n'échouent pas le contrôle : elles demandent un coup d'œil.

set -uo pipefail
RACINE_SCRIPT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=secrets.sh
. "$RACINE_SCRIPT/secrets.sh"
cd "${1:-.}" || exit 2

ECHECS=0; ALERTES=0
if [ -t 1 ]; then R=$'\e[31m'; V=$'\e[32m'; J=$'\e[33m'; G=$'\e[1m'; Z=$'\e[0m'
else R=""; V=""; J=""; G=""; Z=""; fi

ok()     { printf '  %sOK%s      %s\n'     "$V" "$Z" "$1"; }
echec()  { printf '  %sÉCHEC%s   %s\n'     "$R" "$Z" "$1"; ECHECS=$((ECHECS+1)); }
alerte() { printf '  %sALERTE%s  %s\n'     "$J" "$Z" "$1"; ALERTES=$((ALERTES+1)); }
titre()  { printf '\n%s%s%s\n' "$G" "$1" "$Z"; }

# Âge d'un fichier en jours, portable. "?" si indéterminable.
age_jours() {
  [ -e "$1" ] || { echo "?"; return; }
  local m n
  m=$(date -r "$1" +%s 2>/dev/null) || m=$(stat -c %Y "$1" 2>/dev/null) || { echo "?"; return; }
  n=$(date +%s); echo $(( (n - m) / 86400 ))
}
# Écart en jours entre une date AAAA-MM-JJ et aujourd'hui. "?" si illisible.
age_date() {
  local d s n
  d=$(printf '%s' "$1" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1) || true
  [ -n "${d:-}" ] || { echo "?"; return; }
  s=$(date -d "$d" +%s 2>/dev/null) || s=$(date -j -f %Y-%m-%d "$d" +%s 2>/dev/null) || { echo "?"; return; }
  n=$(date +%s); echo $(( (n - s) / 86400 ))
}

printf '%sCONTRÔLE DE CADRE%s — %s\n' "$G" "$Z" "$(pwd)"

# ─── 1. Les fichiers du cadre ────────────────────────────────────────
titre "1. Les fichiers du cadre"
for f in CLAUDE.md ETAT.md memory.md skill.md agents.md verify.md securite.md; do
  [ -f "$f" ] && ok "$f" || echec "$f manquant"
done

# ─── 2. ETAT.md dit-il encore la vérité ? ────────────────────────────
titre "2. Fraîcheur de l'état"
if [ -f ETAT.md ]; then
  a=$(age_jours ETAT.md)
  [ "$a" = "?" ] || [ "$a" -le 7 ] && ok "ETAT.md modifié il y a ${a} j" \
    || alerte "ETAT.md n'a pas bougé depuis ${a} j — il ment probablement"
  d=$(grep -iE '^\*\*Mis à jour' ETAT.md | head -1)
  ad=$(age_date "${d:-}")
  if [ "$ad" = "?" ]; then alerte "ETAT.md : date « Mis à jour » absente ou illisible"
  elif [ "$ad" -gt 7 ]; then echec "ETAT.md se déclare à jour au ${ad} j — dépassé"
  else ok "date déclarée : il y a ${ad} j"; fi
  grep -qiE '^##.*Prochaine action' ETAT.md \
    && { sed -n '/Prochaine action/,/^---/p' ETAT.md | grep -qE '^> \*\*[^<]' \
         && ok "une prochaine action est écrite" \
         || echec "aucune prochaine action concrète dans ETAT.md"; } \
    || echec "ETAT.md n'a pas de section « Prochaine action »"
fi

# ─── 3. Chaque objectif a-t-il sa preuve ? ───────────────────────────
titre "3. Objectifs et preuves"
if [ -f CLAUDE.md ] && [ -f verify.md ]; then
  objs=$(grep -oE '\*\*O[0-9]+\.?\*\*' CLAUDE.md | grep -oE 'O[0-9]+' | sort -u)
  if [ -z "$objs" ]; then alerte "aucun objectif O1, O2… trouvé dans CLAUDE.md"
  else
    for o in $objs; do
      grep -qE "\b${o}\b" verify.md && ok "$o a sa ligne dans verify.md" \
                                    || echec "$o n'a aucune preuve dans verify.md"
    done
  fi
fi

# ─── 4. Les preuves sont-elles fraîches ? ────────────────────────────
titre "4. Fraîcheur des preuves"
if [ -f verify.md ]; then
  d=$(grep -iE 'Dernier passage complet' verify.md | head -1)
  ad=$(age_date "${d:-}")
  if [ "$ad" = "?" ]; then alerte "verify.md : aucun passage complet daté"
  elif [ "$ad" -gt 14 ]; then alerte "dernier verify complet il y a ${ad} j"
  else ok "verify complet il y a ${ad} j"; fi
  grep -qiE '\|\s*(rouge|échec|echec|KO)\b' verify.md \
    && alerte "verify.md contient au moins un résultat rouge — vérifier qu'il est suivi"
fi

if [ -f securite.md ]; then
  d=$(grep -iE '^\*\*Dernier passage' securite.md | head -1)
  ad=$(age_date "${d:-}")
  if [ "$ad" = "?" ]; then alerte "securite.md : aucun passage daté"
  elif [ "$ad" -gt 90 ]; then alerte "dernier passage sécurité il y a ${ad} j — la revue est trimestrielle"
  else ok "passage sécurité il y a ${ad} j"; fi
  grep -qiE '^\| *(immédiat|mise en ligne|toujours).*\*\*Critique\*\*|\*\*Critique\*\*.*\|' securite.md \
    && alerte "securite.md mentionne au moins une faille Critique — vérifier qu'elle est ouverte ou fermée"
fi

# ─── 5. Les clés ─────────────────────────────────────────────────────
titre "5. Les clés"
if git rev-parse --git-dir >/dev/null 2>&1; then
  trouve=0
  for f in .env .env.local .env.production; do
    [ -f "$f" ] || continue
    trouve=1
    git check-ignore -q "$f" && ok "$f est bien ignoré par git" \
                             || echec "$f N'EST PAS ignoré par git — corriger AVANT tout commit"
  done
  [ "$trouve" = 0 ] && alerte "aucun fichier de clés trouvé (normal si le projet n'en a pas)"

  hist=$(git log --all --oneline -- .env .env.local .env.production 2>/dev/null | head -5)
  [ -z "$hist" ] && ok "aucun fichier de clés dans l'historique" \
    || { echec "DES CLÉS SONT DANS L'HISTORIQUE — les révoquer, pas les effacer :"
         printf '%s\n' "$hist" | sed 's/^/            /'; }

  fuite=$(chercher_secrets_git | head -5)
  [ -z "$fuite" ] && ok "aucune valeur de clé en clair dans les fichiers suivis" \
    || { echec "valeur de clé en clair dans un fichier suivi :"
         printf '%s\n' "$fuite" | sed 's/^/            /'; }
else
  alerte "pas un dépôt git — contrôles sur les clés impossibles"
fi

# ─── 6. Gabarits jamais remplis ──────────────────────────────────────
titre "6. Gabarits remplis"
for f in CLAUDE.md ETAT.md verify.md; do
  [ -f "$f" ] || continue
  n=$(grep -oE '<[A-Za-zÀ-ÿ][^>]{4,}>' "$f" 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -le 2 ] && ok "$f est rempli" \
                 || alerte "$f garde ${n} passages de gabarit non remplis"
done

# ─── 7. Blocages ─────────────────────────────────────────────────────
titre "7. Blocages"
if [ -f ETAT.md ]; then
  b=$(sed -n '/## ▸ Bloqué/,/^---/p' ETAT.md | grep -cE '^\|[^-|]*[A-Za-zÀ-ÿ0-9]' || true)
  b=${b:-0}
  b=$((b > 1 ? b - 1 : 0))   # retirer la ligne d'en-tête
  [ "$b" = 0 ] && ok "aucun blocage ouvert" \
               || alerte "${b} blocage(s) ouvert(s) — chacun doit avoir une cause identifiée"
fi

# ─── Verdict ─────────────────────────────────────────────────────────
printf '\n%s────────────────────────────────%s\n' "$G" "$Z"
if [ "$ECHECS" -gt 0 ]; then
  printf '%sCONTRÔLE EN ÉCHEC%s — %d point(s) bloquant(s), %d alerte(s)\n' "$R" "$Z" "$ECHECS" "$ALERTES"
  printf 'La porte ne se franchit pas. Corriger, puis relancer.\n'
  exit 1
fi
printf '%sCONTRÔLE PASSÉ%s — 0 échec, %d alerte(s)\n' "$V" "$Z" "$ALERTES"
[ "$ALERTES" -gt 0 ] && printf 'Les alertes ne bloquent pas, mais aucune ne doit rester sans réponse.\n'
exit 0
