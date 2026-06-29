// Route de diagnostic TEMPORAIRE — affiche la vraie erreur d'initialisation Payload.
// À supprimer une fois le problème résolu.
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const res = await payload.count({ collection: "users" });
    return Response.json({ ok: true, userCount: res.totalDocs });
  } catch (e: unknown) {
    const err = e as { name?: string; message?: string; cause?: unknown; stack?: string };
    return Response.json(
      {
        ok: false,
        name: err?.name ?? null,
        message: err?.message ?? String(e),
        cause: err?.cause ? String((err.cause as { message?: string })?.message ?? err.cause) : null,
        stack: String(err?.stack ?? "").split("\n").slice(0, 10),
      },
      { status: 500 }
    );
  }
}
