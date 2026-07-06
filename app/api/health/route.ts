// Endpoint di health check: verifica che le API route funzionino sul deploy.
// Convenzione D8: chiavi e codice in inglese, UI localizzata.
export function GET() {
  return Response.json({
    service: "complyai",
    status: "ok",
    phase: 1,
  });
}
