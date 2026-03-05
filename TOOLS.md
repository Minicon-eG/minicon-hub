# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Jira / Atlassian

- **Instance:** `minicon.atlassian.net`
- **Confluence Space:** `MINICON`
- **User:** `michael.nikolaus@minicon.eu`
- **Credentials-Datei:** `~/.clawdbot/mcp/atlassian.env`
- **Jira API Endpoint (JQL):** `POST /rest/api/3/search/jql`
- **Hinweis:** Alter Endpoint `/rest/api/3/search` ist deprecated (410).

### Wichtiger Confluence-Link
- **Autonome Website-Deployment-Plattform:**
  - `https://minicon.atlassian.net/wiki/spaces/MINICON/pages/835813377/Autonome+Website-Deployment-Plattform`
- **Immer mit Unterseiten betrachten** (Child-Pages als operative Detailquellen)

### Confluence-Inhalte (grobe Orientierung)
- Plattform-Architektur & Rollen
- Deployment-Ablauf (Build → Test → Rollout)
- Domains/DNS/Cloudflare-Kontext
- Monitoring, Alerting, Healthchecks
- Rollback-/Incident-Runbooks
- Sicherheits-/Zugriffsregeln

## Hetzner (Zugriff)
- **Status:** Zugriff vorhanden (Details lokal pflegen, nicht öffentlich teilen)
- **Provider:** Hetzner Cloud / Robot (je nach Projekt)
- **Produktionsserver:** `minicon-web` (Hetzner)
- **Infrastruktur auf Prod:** Docker + Traefik Reverse Proxy
- **Datenbankzugriff der Agenten:** über SSH-Tunnel `localhost:27018 -> prod:27017 (MongoDB)`
- **Nutzung in Atlas:** Server-Betrieb, DNS-/Routing-nahe Deployments, Incident-Mitigation

### Betriebskontext (aus Plattform-Doku)
- KI-Agenten laufen in der Dev-Umgebung, **nicht** direkt auf dem Produktionsserver.
- Deployments enden in dedizierten Website-Containern, Routing über Traefik auf `*.minicon.eu`.
- QA nach Deployment: Container-Check, HTTP-Check, DB-Sync, Hub-Refresh.

### Pflegehinweis
- API-Tokens/Passwörter **nie im Klartext** in Git speichern.
- Secrets nur über sichere lokale Dateien/Secret-Store referenzieren.
- Bei Änderungen an Servern immer Runbook + Rollback-Schritt mit dokumentieren.

---

Add whatever helps you do your job. This is your cheat sheet.
