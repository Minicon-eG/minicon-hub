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

## CR-Workflow Entscheidungen (März 2026)
- **Nach Ablehnung**: Preview-Branch wird auf Main-Stand zurückgesetzt (verhindert Junk-Commits)
- **Alte CRs**: CRs vor customer-bot Integration (06.03.) brauchen manuelles GitHub Issue + MongoDB-Update
- **Approval-Mail**: Wird erst nach erfolgreichem Preview-Deploy gesendet (cr-deployed Webhook)
- **Preview-Branch**: Wird bei JEDER neuen CR auf main force-reset (nie akkumulieren!)
- **Sequentielle Verarbeitung**: Pro Site nur 1 CR gleichzeitig im preview-Status, nächste wartet (FIFO)
- **Feedback-Loop**: Kunde kann "Anpassen" klicken → Feedback-Formular → CR wird re-processed → neue Vorschau → Zyklus bis Akzeptiert/Abgelehnt
- **E-Mail-Zusammenfassung**: AI-generiert aus Code-Diff, nicht die Anfrage wiederholt
- **Strikte Prompts**: Gemeinsamer DEV_SYSTEM_PROMPT, VERBOTEN-Liste, QA prüft auf ungewollte Änderungen
- **Confluence**: Seite 845447197 ist aktuelle CR-Workflow-Doku (Version 4, Stand 08.03.2026)
- **Auto-Approve (08.03.)**: Einfache CRs gehen direkt auf "preview" → Dev-Worker setzt um. Komplexe brauchen Admin.

## Infrastruktur-Details
- **SSH**: `~/.ssh/id_ed25519` funktioniert, `~/.openclaw/secrets/control-plane-private.key` ist korrupt (PKCS#8)
- **GitHub Actions**: Deployt automatisch bei Push auf main → kein manueller Build nötig
- **Cloudflare Zone ID** (minicon.eu): `14fde5a7044280362d78ab47f2d41390`
- **CF API**: Global Key (`X-Auth-Key: d8b4b6f644c3de1b2573d26027278fd8f4cbb`), nicht Bearer Token
- **Docker Port-Mapping**: SMTP ist `25:25` (NICHT `25:2525`!)
- **Admin-UI**: `admin.minicon.eu` → website-service:4000 (Traefik File-Provider)
- **Kundenportal**: `mein.minicon.eu` → kundenportal:3000
- **Contacts**: Haben keine MongoDB `_id` — immer Email als Identifier verwenden

## Infrastructure Status (08.03.2026)
### GitHub Runners (lokal gestartet)
- ✅ **3/4 online** (docker-runner-1 registriert sich gerade)
- Windows: windows-runner-1, windows-runner-2 (beide online)
- Docker: docker-runner-2 (online), docker-runner-1 (offline, Session-Konflikt)
- Token via GitHub App (ID: 2973586, Private Key: `runner-app.pem`)

### Prod-Server (91.98.30.140 - minicon-web)
- ✅ **Hetzner Cloud** läuft seit 14.02.2026
- **SSH** funktioniert: `ssh root@91.98.30.140`
- **Traefik** konfiguriert (reverse proxy für all services)

### Support-Bot E-Mail System
- **Repo**: `Minicon-eG/minicon-website-service`
- **Container**: `website-service` (auf Prod)
- **SMTP**: Port 2525 (mapped to 25) — empfängt `{siteId}@support.minicon.eu`
- **Bot**: LLM polling alle 30s via Cloudflare Workers AI (Llama 3.1 8B)
- **Eskalation**: `[ESCALATE]` → Telegram Alert an 521366093
- **Ausgehende Mails**: Resend API (`noreply@support.minicon.eu`)
- **Status**: Zu checken ob website-service Container läuft

### Cloudflare Secrets (lokal)
- ✅ `CLOUDFLARE_API_KEY` (d8b4b6f644c3de1b2573d26027278fd8f4cbb)
- ✅ `RESEND_API_KEY` (re_bxqzKnVZ_mEpZzcNyv9FKf1hPJvJevz2v)
- ⚠️ `RESEND_FROM` = noreply@dokukiste.de (sollte noreply@support.minicon.eu sein für Support-System)
