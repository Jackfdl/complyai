// Endpoint di health check: verifica che le API route funzionino sul deploy.
// Utile in Fase 0 per confermare che Vercel serve anche il backend, non solo le pagine.
export function GET() {
  return Response.json({
    servizio: "complyai",
    stato: "ok",
    fase: 0,
  });
}
