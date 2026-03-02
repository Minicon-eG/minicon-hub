# Website-Pipeline

## Ablauf pro Firma

### Schritt 1: Recherche (Gemini)
- Google Maps: Name, Adresse, Bewertungen, Fotos, Öffnungszeiten
- Bestehende Website checken (vorhanden? Qualität?)
- Social Media (Facebook, Instagram)
- Branche und Wettbewerb analysieren
- **Output:** Ausgefülltes Website-Brief → `website-briefs/[name].md`

### Schritt 2: Review (Atlas)
- Brief prüfen und ergänzen
- Design-Richtung festlegen (Farbschema, Stil)
- Priorität setzen
- **Output:** Freigegebenes Brief, Jira-Ticket → "In Progress"

### Schritt 3: Generierung (claude-code)
- Kopiert Schdubb-Template
- Liest Website-Brief als Prompt
- Passt alle Texte, Farben, Bilder an
- Baut und testet lokal
- **Output:** Fertiger `out/` Ordner

### Schritt 4: Deployment (Atlas/Scotty)
- SCP nach minicon-web
- Docker Container starten (nginx:alpine)
- Traefik-Labels für [name].minicon.eu
- DNS: CNAME → minicon.eu (falls nötig)
- **Output:** Live-URL

### Schritt 5: QA-Trigger (Atlas → QA-Agent)
- Nach jedem Deployment: `sessions_send` an `agent:qa:main`
- Format: `Website: https://[name].minicon.eu\nJira-Parent: DAHN-X\nFirma: [Name]`
- QA testet: Status, 404s, Content, Responsive, Performance
- QA erstellt Sub-Task in Jira mit Bericht
- Michael reviewed → Approved oder Improvement-Loop

## Speicherorte
- **Briefs:** `C:\Working\minicon-hub\website-briefs\[name].md`
- **Code:** `C:\Working\[name]-website\`
- **Template:** `C:\Working\paelzer-schdubb-website\` (Referenz)
- **Server:** `/opt/sites/[name]/` auf minicon-web
- **Jira:** DAHN-Projekt

## claude-code Prompt-Template
```
Erstelle eine Website basierend auf dem folgenden Brief.
Nutze C:\Working\paelzer-schdubb-website als Template (kopiere nach C:\Working\[name]-website).

[BRIEF HIER EINFÜGEN]

Technisch:
- Next.js 14, Tailwind CSS, Static Export
- npm install && npm run build
- out/ Ordner muss erstellt werden
- Mobile-first, Lighthouse > 90
```
