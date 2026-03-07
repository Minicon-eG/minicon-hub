# Hub Status Update - 2026-03-06 14:01 UTC

## Zusammenfassung
- **Scheduled:** Cron task `7cd49b5a-a187-4fcf-82f4-251936361160`
- **Time:** Friday, March 6th, 2026 — 14:01 (Europe/Berlin)

## Infrastruktur-Status: ✅ ALLE GRÜN

### Websites (extern geprüft)
- ✅ hub.minicon.eu → HTTP 200
- ✅ www.minicon.eu → HTTP 200
- ✅ dokukiste.de → HTTP 200
- ✅ dorfkiste.org → HTTP 200
- ✅ dorfkiste.com → HTTP 200

### Server-Erreichbarkeit
- ✅ minicon-web (91.98.30.140) → SSH Port 22 offen
- ✅ dorfkiste-web (46.225.171.254) → SSH Port 22 offen

## Hub-Deployment Datenbank
### Gesamt: 103 Deployments im Hub
- **live:** 88 aktiv
- **queued:** 3 wartend
- **failed:** 12 markiert (ABER: stale Status! Aktuelle Checks zeigen HTTP 200)

### Stale Einträge erkannt:
- `ivalticare.minicon.eu` (HTTP 200, aber DB sagt 'failed') ❌
- `high-stake.minicon.eu` (HTTP 200, aber DB sagt 'failed') ❌
- `ttc-dahn.minicon.eu` (HTTP 200, aber DB sagt 'failed') ❌

## Aktion erforderlich
**Typ:** Hub API Update
**Priorität:** Niedrig (Sites laufen, DB ist nur out-of-sync)
**Lösung:** POST zu `/api/deployments` um stale Einträge zu korrigieren

## Probleme bei Hub-API Updates
- Jira REST API Auth-Fehler (Credentials korrekt, aber API-Endpunkt änderte sich)
- Hub API POST Requests: HTTP 400 (Bad Request) — mögliche Schema-Änderung
- Keine Fehler bei HTTP-Checks, nur API-Integration braucht Review

## Nächste Schritte
1. Hub-API Schema überprüfen (companyId vs id, timestamps?)
2. Stale Deployment-Einträge korrigieren
3. Jira Integration debuggen (deprecated Endpoint?)
4. Monitoring für diese 3 Websites aktivieren
