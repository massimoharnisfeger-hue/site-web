#!/usr/bin/env bash
# Installe le cadre pour TOUS tes projets, pas seulement ce dépôt.
#
#   bash .claude/skills/cadre-projet/install.sh
#
# Copie le skill dans ~/.claude/skills/ et l'agent dans ~/.claude/agents/.
# Relançable sans risque : réécrit la version installée par celle du dépôt.

set -euo pipefail

SRC=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
RACINE=$(cd "$SRC/../../.." && pwd)
AGENT="$RACINE/.claude/agents/gardien-cadre.md"
DEST_SKILLS="$HOME/.claude/skills"
DEST_AGENTS="$HOME/.claude/agents"

if [ -t 1 ]; then V=$'\e[32m'; J=$'\e[33m'; G=$'\e[1m'; Z=$'\e[0m'
else V=""; J=""; G=""; Z=""; fi

printf '%sInstallation du cadre projet%s\n\n' "$G" "$Z"

mkdir -p "$DEST_SKILLS" "$DEST_AGENTS"

[ -d "$DEST_SKILLS/cadre-projet" ] && deja=1 || deja=0
rm -rf "$DEST_SKILLS/cadre-projet"
cp -r "$SRC" "$DEST_SKILLS/cadre-projet"
rm -f "$DEST_SKILLS/cadre-projet/install.sh"
if [ "$deja" = 1 ]; then printf '  %smis à jour%s  %s\n' "$J" "$Z" "$DEST_SKILLS/cadre-projet"
else printf '  %sinstallé%s    %s\n' "$V" "$Z" "$DEST_SKILLS/cadre-projet"; fi

if [ -f "$AGENT" ]; then
  cp "$AGENT" "$DEST_AGENTS/gardien-cadre.md"
  printf '  %sinstallé%s    %s\n' "$V" "$Z" "$DEST_AGENTS/gardien-cadre.md"
else
  printf '  %signoré%s      agent gardien-cadre introuvable (%s)\n' "$J" "$Z" "$AGENT"
fi

cat <<MSG

${G}C'est fait.${Z} Dans n'importe quel projet :

    /cadre-projet

Il se déclenche aussi tout seul sur « on démarre », « où on en est »,
« ajoute donc… », « ça marche pas », « c'est fini ? ».

Le mode d'emploi est là :
    $DEST_SKILLS/cadre-projet/MODE-EMPLOI.md
MSG
