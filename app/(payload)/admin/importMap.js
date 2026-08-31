// Volontairement vide — NE PAS régénérer avec `payload generate:importmap`.
// La version generee importe @payloadcms/storage-vercel-blob/client, qui tire
// les internes serveur de Payload (pino -> worker_threads, node:assert) dans le
// bundle client et fait échouer `next build`. Le back-office fonctionne sans,
// tant qu'aucun composant d'admin personnalisé n'est ajoute.
export const importMap = {};
