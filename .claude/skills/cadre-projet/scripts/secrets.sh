# Détection de secrets — motif PARTAGÉ par les deux contrôles.
# Un seul endroit : deux copies divergeraient à la première correction.
#
# Ce qu'on cherche : un nom qui SE TERMINE par KEY / SECRET / TOKEN / PASSWORD,
# suivi d'une valeur d'au moins 20 caractères.
# Ce qu'on écarte, parce que ce sont des noms et non des secrets :
#   - les chemins de fichiers et les valeurs à extension
#   - les valeurs en minuscules-tirets (une clé de localStorage, un identifiant)

SQ=$(printf '\047')
MOTIF_SECRET="(^|[^A-Za-z0-9_])([A-Z0-9]+_)*(API_?KEYS?|SECRETS?|TOKENS?|PASSWORDS?|PASSWD|KEYS?)[[:space:]]*[=:][[:space:]]*[\"${SQ}][A-Za-z0-9+/=_-]{20,}[\"${SQ}]"

_filtrer_faux_positifs() {
  grep -vE "[\"${SQ}][^\"${SQ}]*\.(json|css|js|jsx|ts|tsx|map|md|txt|ya?ml|png|svg|webp|env)[\"${SQ}]" \
  | grep -vE "[\"${SQ}](\./|/|[a-z0-9_-]+/)" \
  | grep -vE "[=:][[:space:]]*[\"${SQ}][a-z][a-z-]*[\"${SQ}]"
}

# Dans les fichiers suivis par git.
chercher_secrets_git() {
  git grep -nIE "$MOTIF_SECRET" \
    -- . ':!*.example' ':!.claude/skills/cadre-projet/*' 2>/dev/null \
  | _filtrer_faux_positifs
}

# Dans un dossier quelconque — sert à fouiller la sortie de build.
chercher_secrets_dossier() {
  [ -d "$1" ] || return 0
  grep -rnIE "$MOTIF_SECRET" "$1" 2>/dev/null | _filtrer_faux_positifs
}
