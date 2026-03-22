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

## Atlassian (Confluence & Jira)

- **Instance:** https://minicon.atlassian.net
- **User:** michael.nikolaus@minicon.eu
- **Credentials:** C:\Users\Michael\.openclaw\secrets\atlassian.env
- **Confluence Auth:** Basic Auth (base64 von mail:token)

### Confluence API (v1 — NICHT v2!)
- **Base URL:** https://minicon.atlassian.net/wiki/rest/api
- **Spaces:** GET/POST /space
- **Pages:** GET/POST /content
- **Example:** curl -s -X GET "https://minicon.atlassian.net/wiki/rest/api/space" -H "Authorization: Basic ""

### Jira API (v3)
- **Base URL:** https://minicon.atlassian.net/rest/api/3
- **Search:** POST /search/jql
- **Example:** curl -s -X POST "https://minicon.atlassian.net/rest/api/3/search/jql" -H "Authorization: Basic """ -H "Content-Type: application/json" -d "'{"jql":"project = PDFM ORDER BY updated DESC","maxResults":10}'"

### Spaces
- **ME** - Minicon eG (Intern)
- **PDFM** - PdfManagement (Produkt)
- **DORF** - Dorfkiste