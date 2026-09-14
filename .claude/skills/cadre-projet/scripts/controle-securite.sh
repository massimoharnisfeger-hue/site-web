#!/usr/bin/env bash
# Contrôle de sécurité — la partie MÉCANISABLE du registre securite.md.
# Il ne remplace pas le registre : les tests manuels (injection, session,
# restauration de sauvegarde) restent à passer à la main.
#
#   bash .claude/skills/cadre-projet/scripts/controle-securite.sh [url] [dossier]
#
# Sortie : 0 si aucun point bloquant, 1 sinon.

set -uo pipefail
RACINE_SCRIPT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=secrets.sh
. "$RACINE_SCRIPT/secrets.sh"

URL="${1:-}"
cd "${2:-.}" || exit 2

ECHECS=0; ALERTES=0
if [ -t 1 ]; then R=$'\e[31m'; V=$'\e[32m'; J=$'\e[33m'; G=$'\e[1m'; Z=$'\e[0m'
else R=""; V=""; J=""; G=""; Z=""; fi
ok()     { printf '  %sOK%s      %s\n' "$V" "$Z" "$1"; }
echec()  { printf '  %sÉCHEC%s   %s\n' "$R" "$Z" "$1"; ECHECS=$((ECHECS+1)); }
alerte() { printf '  %sALERTE%s  %s\n' "$J" "$Z" "$1"; ALERTES=$((ALERTES+1)); }
titre()  { printf '\n%s%s%s\n' "$G" "$1" "$Z"; }

printf '%sCONTRÔLE DE SÉCURITÉ%s — %s\n' "$G" "$Z" "$(pwd)"

# Où le build dépose ses fichiers, selon l'outil.
DOSSIERS_BUILD=""
for d in .next dist build out public; do [ -d "$d" ] && DOSSIERS_BUILD="$DOSSIERS_BUILD $d"; done

# ─── 1. Secrets ──────────────────────────────────────────────────────
titre "1. Secrets (S1–S4)"
if git rev-parse --git-dir >/dev/null 2>&1; then
  vu=0
  for f in .env .env.local .env.production; do
    [ -f "$f" ] || continue; vu=1
    git check-ignore -q "$f" && ok "S1 · $f est ignoré par git" \
                             || echec "S1 · $f N'EST PAS ignoré — critique"
  done
  [ "$vu" = 0 ] && ok "S1 · aucun fichier de clés en clair dans l'arbre"

  h=$(git log --all --oneline -- .env .env.local .env.production 2>/dev/null | head -3)
  [ -z "$h" ] && ok "S2 · aucun fichier de clés dans l'historique" \
    || { echec "S2 · CLÉS DANS L'HISTORIQUE — les révoquer, pas les effacer :"
         printf '%s\n' "$h" | sed 's/^/            /'; }

  f=$(chercher_secrets_git | head -5)
  [ -z "$f" ] && ok "S3 · aucune valeur de clé en clair dans le code suivi" \
    || { echec "S3 · valeur de clé en clair :"; printf '%s\n' "$f" | sed 's/^/            /'; }
else
  alerte "pas un dépôt git — S1 à S3 impossibles"
fi

# S4 : un secret qui atteint le navigateur est déjà public.
if [ -n "$DOSSIERS_BUILD" ]; then
  trouve=""
  for d in $DOSSIERS_BUILD; do trouve="$trouve$(chercher_secrets_dossier "$d" | head -3)"; done
  [ -z "$trouve" ] && ok "S4 · aucun secret dans la sortie de build ($(echo $DOSSIERS_BUILD | tr ' ' ','))" \
    || { echec "S4 · SECRET DANS LE PAQUET LIVRÉ AU NAVIGATEUR :"
         printf '%s\n' "$trouve" | sed 's/^/            /'; }
else
  alerte "S4 · aucun dossier de build trouvé — lancer le build puis relancer ce contrôle"
fi

# ─── 2. Dépendances ──────────────────────────────────────────────────
titre "2. Dépendances (D1–D2)"
if [ -f package.json ]; then
  if npm audit --audit-level=critical >/dev/null 2>&1; then
    if npm audit --audit-level=high >/dev/null 2>&1; then
      ok "D1 · aucune faille connue de gravité haute ou critique"
    else
      alerte "D1 · faille(s) de gravité haute : $(npm audit 2>/dev/null | grep -iE '^[0-9]+ vulnerabilit' | head -1)"
    fi
  else
    echec "D1 · faille(s) CRITIQUE(s) : $(npm audit 2>/dev/null | grep -iE '^[0-9]+ vulnerabilit' | head -1)"
  fi
  if [ -f package-lock.json ] || [ -f yarn.lock ] || [ -f pnpm-lock.yaml ]; then
    ok "D2 · les versions sont verrouillées"
  else
    alerte "D2 · aucun fichier de verrou — les versions peuvent bouger sans qu'on le sache"
  fi
else
  alerte "pas de package.json — D1 et D2 non applicables"
fi

# ─── 3. Surface exposée ──────────────────────────────────────────────
titre "3. Surface exposée (X2, T3)"
PUBLICS=""
for d in public static www dist out; do [ -d "$d" ] && PUBLICS="$PUBLICS $d"; done
if [ -n "$PUBLICS" ]; then
  sensibles=$(find $PUBLICS \( -name '.env*' -o -name '*.sql' -o -name '*.bak' -o -name '*.dump' \
               -o -name '*.pem' -o -name '*.key' -o -name '.git' -o -name '*.sqlite*' \) 2>/dev/null | head -5)
  [ -z "$sensibles" ] && ok "X2 · aucun fichier sensible dans les dossiers publics" \
    || { echec "X2 · fichier sensible servi publiquement :"; printf '%s\n' "$sensibles" | sed 's/^/            /'; }
else
  alerte "X2 · aucun dossier public identifié"
fi

if [ -n "$DOSSIERS_BUILD" ]; then
  n=$(find $DOSSIERS_BUILD -name '*.map' 2>/dev/null | wc -l | tr -d ' ')
  [ "${n:-0}" -eq 0 ] && ok "T3 · aucune carte de source dans la sortie de build" \
    || alerte "T3 · ${n} carte(s) de source (.map) — elles exposent le code d'origine"
fi

# ─── 4. Transport et en-têtes ────────────────────────────────────────
titre "4. Transport et en-têtes (T1–T2)"
if [ -n "$URL" ]; then
  entetes=$(curl -sI --max-time 15 "$URL" 2>/dev/null)
  if [ -z "$entetes" ]; then
    alerte "T1 · $URL injoignable"
  else
    case "$URL" in
      https://*) ok "T1 · l'URL contrôlée est en HTTPS" ;;
      *) echec "T1 · l'URL contrôlée n'est pas en HTTPS" ;;
    esac
    for e in content-security-policy x-content-type-options referrer-policy \
             x-frame-options strict-transport-security; do
      printf '%s' "$entetes" | grep -qi "^${e}:" && ok "T2 · $e présent" \
                                                 || alerte "T2 · $e absent"
    done
  fi
else
  alerte "T1–T2 · aucune URL fournie — relancer avec l'URL de production"
fi

# ─── Verdict ─────────────────────────────────────────────────────────
printf '\n%s────────────────────────────────%s\n' "$G" "$Z"
printf 'Rappel : ce contrôle ne couvre PAS l'"'"'injection, la session, les droits\n'
printf 'd'"'"'accès ni la restauration de sauvegarde. Ces tests-là sont dans\n'
printf 'securite.md et se passent à la main.\n\n'
if [ "$ECHECS" -gt 0 ]; then
  printf '%sCONTRÔLE EN ÉCHEC%s — %d bloquant(s), %d alerte(s)\n' "$R" "$Z" "$ECHECS" "$ALERTES"
  exit 1
fi
printf '%sCONTRÔLE PASSÉ%s — 0 bloquant, %d alerte(s)\n' "$V" "$Z" "$ALERTES"
exit 0
