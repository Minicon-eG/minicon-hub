# MEMORY.md — Atlas (langfristig)

## Zweck
- Atlas ist der **proaktive Projektmanager** für Website- und Deployment-Themen bei Minicon.
- Atlas ist Website-/Deploy-Orchestrator für Minicon-Websites (u. a. DAHN-Cluster, Hub-Status, Uptime-Monitoring).
- Atlas kennt sich mit **Cloudflare** (DNS, Proxy, SSL/TLS, Caching, Rules, Zero-Downtime-Umschaltungen) aus und nutzt dieses Wissen aktiv.

## Aktuelles Setup
- Workspace: `C:\working\atlas`
- Wichtige Cron-Jobs:
  - `DAHN Website Pipeline` (alle 3h)
  - `QA DAHN Website Review` (alle 6h)
  - `Hub Status Update` (alle 2h)
  - `Agent Activity Sync` (alle 6h)

## Bekannte Probleme
- Wiederkehrende Cron-Fehler durch Modell-/Tool-Mismatch (`gemma3:27b does not support tools`).
- Zeitweise Provider-Rate-Limits (`429`) bei Anthropic.
- Memory-Dateien/Ordner wurden am 04.03.2026 offenbar durch Workspace-Overwrite entfernt und neu angelegt.

## Atlassian / Confluence Referenz
- Primäre Doku für Deploy-Logik (inkl. Unterseiten):
  - https://minicon.atlassian.net/wiki/spaces/MINICON/pages/835813377/Autonome+Website-Deployment-Plattform
- Regel: Bei Entscheidungen immer die Parent-Page **und relevante Child-Pages** berücksichtigen.

### Grobe Inhaltsübersicht (Arbeitsannahme, bis vollständig gelesen)
- Architektur der autonomen Deployment-Plattform (Komponenten, Rollen, Ablauf)
- Umgebungen & Domains (z. B. Dev/Staging/Prod, DNS/Cloudflare)
- Deployment-Pipeline (Build, Test, Rollout, Healthchecks)
- Monitoring/Alerting & Betriebsregeln (Uptime, Eskalation, Rollback)
- Sicherheits- und Zugriffsregeln (Secrets, Berechtigungen, Verantwortlichkeiten)
- Betriebs-Runbooks als Unterseiten (Standardabläufe + Störungsbehebung)

## Empfehlungen
- Für tool-lastige Cron-Jobs nur tool-fähige Modelle verwenden.
- `memory/` niemals per Deploy/Sync überschreiben.
- Nach großen Workspace-Syncs Integritätscheck fahren (`memory/`, `MEMORY.md`, `AGENTS.md`, `SOUL.md`).
- Bei Deployment-Entscheidungen Confluence-Doku als Source of Truth verwenden.
