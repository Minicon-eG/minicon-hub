# DAHN Website-Entwicklung — Vorgaben

## Umlaute & Encoding (PFLICHT!)

**Alle Texte MÜSSEN korrekte deutsche Umlaute verwenden:**
- ä, ö, ü, Ä, Ö, Ü, ß — NIEMALS ae, oe, ue als Ersatz!
- Dateien IMMER als **UTF-8** speichern
- In Next.js: `<html lang="de">` setzen
- Bei API-Aufrufen (xAI, Jira): Body als UTF-8 Bytes senden
- PowerShell: `[System.Text.Encoding]::UTF8.GetBytes($body)` verwenden
- HTML-Entities vermeiden wo möglich — lieber direkte Zeichen (ä statt &auml;)

**Häufige Fehler:**
- `Pf&#228;lzer` statt `Pfälzer` → Encoding-Problem beim Build
- `Spezialit\u00e4ten` → JSON-Escape nicht aufgelöst
- Dateinamen mit Umlauten vermeiden (URLs!) → `dahner-huette` statt `dahner-hütte`

## Tech Stack (PFLICHT)
- **Framework:** Next.js 14 mit App Router
- **Styling:** Tailwind CSS
- **Output:** Static Export (`output: 'export'` in next.config.js)
- **Sprache:** TypeScript
- **Icons:** Lucide React
- **Hosting:** Nginx-Container auf minicon-web (91.98.30.140)

## Referenz-Projekt
`C:\Working\paelzer-schdubb-website\` — JEDE neue Website wird nach diesem Muster gebaut.

## Struktur (PFLICHT)
```
src/
  app/
    page.tsx          # Hauptseite (Single-Page mit Sections)
    layout.tsx        # Root Layout mit Metadata
    impressum/page.tsx
    datenschutz/page.tsx
    globals.css       # Tailwind + Custom Colors
public/
  images/             # Bilder (generiert via xAI Grok)
next.config.js        # output: 'export', images: { unoptimized: true }
tailwind.config.ts
package.json
```

## Design-Vorgaben (PFLICHT!)

### Bestehende Website analysieren (PFLICHT wenn vorhanden!)
- **Wenn das Geschäft bereits eine Website hat:** Diese ZUERST analysieren!
- **Layout übernehmen & modernisieren:** Gutes Layout beibehalten, aber modern und responsive umsetzen
- **Logo übernehmen:** Das Original-Logo herunterladen und verwenden. Wenn die Qualität schlecht ist (pixelig, zu klein), das Logo verbessern/nachbauen — aber das Design beibehalten!
- **Farbschema ableiten:** Farben aus dem bestehenden Logo/Branding übernehmen
- **Struktur respektieren:** Wenn die alte Seite z.B. Speisekarte, Galerie, Über uns hatte → gleiche Sections anbieten
- **Verbessern, nicht neu erfinden:** Ziel ist eine modernisierte Version der bestehenden Seite, kein komplett neues Design

### Bestehende Inhalte übernehmen (PFLICHT!)
- **Wenn das Geschäft eine bestehende Website hat:** ALLE individuellen Inhalte übernehmen!
- **Einzigartige Texte, Angebote, Programme** — z.B. Wanderprogramme, Veranstaltungskalender, Übernachtungsinfos, Vereinsgeschichte
- **PDFs und Dokumente** verlinken oder Inhalte in die neue Seite integrieren
- **Veraltete Daten kennzeichnen:** Wenn Inhalte übernommen werden aber möglicherweise nicht mehr aktuell sind, IMMER einen Hinweis schreiben: "Stand: [Datum] — Aktuelle Informationen bitte beim Betreiber erfragen"
- **Beispieldaten kennzeichnen:** Wenn echte Daten fehlen und Beispiele verwendet werden: "Dies sind Beispieldaten — bitte kontaktieren Sie uns für aktuelle Informationen"
- **NIEMALS individuelle Inhalte weglassen!** Das ist der Mehrwert der bestehenden Seite

### Individualität — KRITISCH! Jede Website MUSS einzigartig sein!

⚠️ **DAS IST DIE WICHTIGSTE REGEL!** Wenn alle Websites gleich aussehen, ist das Produkt wertlos.

- **KEINE Templates oder Copy-Paste-Designs!** Jede Website bekommt ein KOMPLETT eigenes Design.
- **NICHT einfach Farben tauschen und gleiche Struktur verwenden!** Das reicht NICHT.
- Jede Website braucht: eigene Farbpalette, eigenes Layout, eigene Typografie-Kombination, eigene Section-Reihenfolge, eigenen visuellen Charakter.
- Vor dem Design: 2-3 echte Referenz-Websites der gleichen Branche anschauen und sich inspirieren lassen.

### Pflicht: Eigene Design-Tokens pro Projekt

Jedes Projekt MUSS in `globals.css` eigene CSS-Variablen definieren. NIEMALS die gleichen Farben/Fonts wie ein anderes Projekt verwenden!

```css
/* Beispiel Pizzeria — warm, italienisch */
:root {
  --color-primary: #8B2500;      /* Terracotta */
  --color-secondary: #2D5F2D;    /* Olivgrün */
  --color-accent: #DAA520;       /* Gold */
  --color-bg: #FFF8F0;           /* Warm Cream */
  --color-text: #2C1810;         /* Dunkelbraun */
  --font-heading: 'Georgia', 'Palatino', serif;
  --font-body: 'Segoe UI', system-ui, sans-serif;
}

/* Beispiel Steakhouse — dunkel, kräftig */
:root {
  --color-primary: #1A1A2E;      /* Midnight */
  --color-secondary: #C0392B;    /* Feuerrot */
  --color-accent: #F39C12;       /* Amber */
  --color-bg: #0F0F0F;           /* Fast Schwarz */
  --color-text: #ECECEC;         /* Hellgrau */
  --font-heading: 'Impact', 'Arial Black', sans-serif;
  --font-body: 'Trebuchet MS', system-ui, sans-serif;
}

/* Beispiel Wanderhütte — natürlich, rustikal */
:root {
  --color-primary: #4A6741;      /* Waldgrün */
  --color-secondary: #8B6914;    /* Holzbraun */
  --color-accent: #CD853F;       /* Peru */
  --color-bg: #F5F0E8;           /* Naturweiß */
  --color-text: #3E2723;         /* Dunkelbraun */
  --font-heading: 'Cambria', 'Book Antiqua', serif;
  --font-body: 'Calibri', system-ui, sans-serif;
}

/* Beispiel IT-Unternehmen — clean, technisch */
:root {
  --color-primary: #0D47A1;      /* Tiefblau */
  --color-secondary: #00BCD4;    /* Cyan */
  --color-accent: #FF6F00;       /* Orange */
  --color-bg: #FAFAFA;           /* Reinweiß */
  --color-text: #212121;         /* Fast Schwarz */
  --font-heading: 'Segoe UI', system-ui, sans-serif;
  --font-body: 'Consolas', 'Courier New', monospace;  /* Tech-Feel */
}

/* Beispiel Sportverein — dynamisch, energetisch */
:root {
  --color-primary: #1565C0;      /* Vereinsblau */
  --color-secondary: #FFC107;    /* Gelb */
  --color-accent: #E53935;       /* Rot */
  --color-bg: #FFFFFF;
  --color-text: #1B1B1B;
  --font-heading: 'Arial Black', 'Helvetica Neue', sans-serif;
  --font-body: 'Arial', system-ui, sans-serif;
}
```

### Pflicht: Unterschiedliche Layouts!

Nicht jede Website braucht die gleiche Section-Reihenfolge! Variiere:

- **Restaurant A:** Hero → Speisekarte → Galerie → Über uns → Kontakt
- **Restaurant B:** Hero → Über uns (mit Bild) → Highlight-Gerichte → Reservierung → Speisekarte
- **Verein:** Hero mit Vereinslogo → Aktuelles → Abteilungen → Geschichte → Mitglied werden
- **IT-Firma:** Hero → Leistungen (Grid) → Case Studies → Team → Technologien → Kontakt
- **Pension:** Hero mit Zimmerfotos → Zimmer & Preise → Umgebung → Bewertungen → Buchung

### Pflicht: Unterschiedliche visuelle Elemente!

Variiere zwischen Projekten:
- **Formen:** Manche Sites rund (border-radius), manche eckig, manche mit Clip-Path
- **Hintergründe:** Manche hell, manche dunkel, manche mit Texturen/Patterns
- **Navigation:** Manche oben fixiert, manche transparent, manche mit Hamburger-Menü
- **Hero:** Manche Fullscreen, manche Split (Text links, Bild rechts), manche mit Video-Hintergrund
- **Cards vs. Listen vs. Grids:** Nicht immer die gleiche Darstellungsart
- **Animationen:** Manche Fade-in, manche Slide, manche ohne — passend zum Charakter

### Branchenspezifische Design-Richtungen:
- **Pizzeria/Italiener:** Warme Rottöne, Terracotta, geschwungene Elemente, Vintage-Flair
- **Steakhouse/Grill:** Dunkle Töne, Schwarz/Rot/Gold, kräftig, Feuer-Ästhetik
- **Wanderhütte/Pension:** Naturfarben, Grün/Braun, rustikal, Holz-Textur-Elemente
- **Sportverein:** Vereinsfarben dominant, dynamisch, schräge Linien, energetisch
- **IT-Unternehmen:** Clean, viel Whitespace, geometrisch, technische Fonts, Blau/Cyan
- **Shisha-Bar:** Orientalisch, Gold/Lila/Dunkelblau, ornamental, atmosphärisch
- **Bäckerei/Café:** Pastelltöne, Rosé/Beige, verspielt, gemütlich
- **Gasthaus/traditionell:** Bordeaux/Creme, klassisch, Wappen-Elemente, gediegen
- **Weinstube:** Weinrot/Gold, elegant, Serif-Fonts, Weinreben-Motive

### Generelle Design-Regeln:
- **Responsive:** Mobile-first, funktioniert auf allen Geräten
- **Farben:** INDIVIDUELL pro Projekt via CSS-Variablen (siehe oben)
- **Schrift:** System-Fonts (keine Google Fonts wegen DSGVO), aber VERSCHIEDENE Kombinationen pro Projekt
- **Hero-Section:** Fullscreen mit Hintergrundbild + Overlay
- **Sections:** Über uns, Speisekarte/Angebot, Öffnungszeiten, Kontakt, Anfahrt
- **Footer:** Impressum + Datenschutz Links (PFLICHT!)
- **Google Maps:** Zwei-Klick-Consent (siehe unten)
- **Cookie-Banner:** NICHT nötig (keine Cookies, keine Tracker)
- **Animationen:** Dezent und modern (z.B. Scroll-Reveals, Hover-Effekte) — nicht übertreiben

## Inhalt (PFLICHT)
- **NUR echte, verifizierte Daten!** Keine Fake-Telefonnummern, Adressen, Öffnungszeiten
- Telefonnummer mit `tel:` Link
- Adresse mit Google Maps Embed
- Öffnungszeiten in Tabelle
- Impressum mit echtem Betreiber (soweit bekannt)
- Datenschutz-Seite (Standard-Template)

## Echte Speisekarte bei Restaurants (PFLICHT!)

**NIEMALS ausgedachte Gerichte oder Preise verwenden!**

### Recherche-Quellen (in dieser Reihenfolge prüfen):
1. **Bestehende Website** des Restaurants (aus OSM `extratags.website` / `contact:website`)
2. **Lieferando / Lieferheld** — oft vollständige Karte mit Preisen
3. **Google Maps** — Menü-Fotos / Speisekarte-Tab
4. **TripAdvisor** — Menü-Fotos in Bewertungen
5. **Facebook-Seite** — Speisekarte oft als Foto gepostet

### Vorgehen:
- Bei der **Recherche-Phase** (OSM + web_fetch) IMMER nach Speisekarte suchen
- Alle gefundenen Gerichte + Preise im **Website-Brief** unter `## Echte Speisekarte` dokumentieren
- Quelle angeben (URL)
- Falls keine Karte auffindbar: im Brief vermerken, dann generische regionale Karte verwenden und kennzeichnen: "Beispielkarte — Aktuelle Preise bitte vor Ort erfragen"

## Bilder (PFLICHT — Echte Bilder bevorzugen!)

### Priorität: Originalbilder vom Geschäft verwenden!
1. **Bestehende Website** des Geschäfts → Bilder herunterladen (Hero, Interieur, Produkte/Speisen)
2. **Google Maps Fotos** → Geschäftsfotos, Innenansichten, Speisen
3. **Facebook/Instagram** → Offizielle Seite des Geschäfts
4. **TripAdvisor** → Fotos von Gästen
5. **Lieferando** → Produktfotos

### Nur als Fallback: KI-generierte Bilder
- Generiert via `scripts/generate-website-images.ps1` (xAI Grok)
- Typen: `restaurant`, `cafe`, `hotel`, `handwerk`, `generic`
- NUR verwenden wenn keine echten Fotos auffindbar sind!
- Im Brief dokumentieren welche Bilder echt und welche generiert sind

### Vorgehen bei der Recherche:
- Bei der Recherche-Phase IMMER nach echten Fotos suchen
- Bilder in `public/images/` speichern (nicht in `generated/` wenn echt)
- Hero-Bild: Echtes Foto vom Geschäft/Gebäude bevorzugen
- Mindestens 3-5 Bilder pro Website
- Hero-Bild als Background in Hero-Section

## Cookie Notice / DSGVO (PFLICHT-PRÜFUNG!)

Bei jeder Website prüfen ob ein Cookie-Banner nötig ist:

### Wann KEIN Cookie-Banner nötig:
- Rein statische Website ohne Tracking
- Keine Google Analytics, Facebook Pixel, etc.
- Keine externen Fonts (Google Fonts) — wir nutzen System Fonts ✅
- Keine eingebetteten YouTube/Vimeo Videos
- Google Maps Embed per iframe = **technisch notwendig, ABER** personenbezogene Daten werden an Google übertragen

### Wann Cookie-Banner PFLICHT:
- Google Analytics oder andere Tracking-Tools
- Facebook Pixel, LinkedIn Insight Tag
- Eingebettete YouTube/Vimeo Videos (laden Cookies)
- Google Maps Embed iframe → **Ja, braucht Consent!** Alternative: statisches Kartenbild mit Link zu Google Maps
- Jede Art von externem Tracking/Marketing-Cookie

### Unsere Standard-Lösung:
Da wir **Google Maps iframes** einbetten, brauchen wir mindestens einen **Zwei-Klick-Consent**:
1. Statt iframe direkt zu laden: Platzhalter-Box mit Text "Karte laden — Dabei werden Daten an Google übertragen" + Button "Karte anzeigen"
2. Erst nach Klick wird der iframe geladen
3. Auf der Datenschutz-Seite den Google Maps Hinweis dokumentieren

### Implementierung (Zwei-Klick Google Maps):
```tsx
'use client'
import { useState } from 'react'

function GoogleMapsEmbed({ src, title }: { src: string; title: string }) {
  const [accepted, setAccepted] = useState(false)
  
  if (!accepted) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-2 font-medium">Google Maps Karte</p>
        <p className="text-gray-500 text-sm mb-4">
          Beim Laden der Karte werden Daten an Google übertragen.
        </p>
        <button
          onClick={() => setAccepted(true)}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Karte anzeigen
        </button>
      </div>
    )
  }
  
  return (
    <iframe src={src} width="100%" height="100%" style={{ border: 0, minHeight: 400 }}
      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={title} />
  )
}
```

### Wenn kein Google Maps iframe und sonst keine externen Dienste:
- Kein Cookie-Banner nötig
- Trotzdem Datenschutz-Seite mit Hinweis auf Hosting-Provider (Hetzner) und Cloudflare

## Build & Deploy
```powershell
# 1. Build
cd C:\Working\website-<name>\
npm run build

# 2. Deploy
.\scripts\deploy-static-site.ps1 -Site <name> -Domain <name>.minicon.eu -SourceDir .\out

# ODER manuell:
scp -r out\* root@91.98.30.140:/opt/sites/<name>/
ssh root@91.98.30.140 "bash /opt/scripts/post-deploy-checks.sh <name> <name>.minicon.eu"
```

## Deploy-Reihenfolge (IMMER!)

Das Deploy-Script `deploy-static-site.ps1` macht automatisch:
1. SCP Upload
2. `chmod -R 755` (SCP setzt Verzeichnisse auf 700 → nginx 403!)
3. `fix-container.sh` (Volume Mount + Traefik Labels prüfen)
4. **Cloudflare Cache Purge** (sonst cached CF alte 403er!)
5. Post-deploy Checks

**Bei manuellem Deploy** diese Schritte IMMER einhalten!
Besonders: `chmod -R 755` + Cloudflare Cache Purge nach JEDEM Upload.

## Post-Deploy Checks (AUTOMATISCH)
1. ✅ Permissions 755
2. ✅ Container läuft
3. ✅ HTTP 200
4. ✅ Static Assets lesbar
5. ✅ Disk Space < 85%
6. ✅ Keine Fehler im Log

## Nginx Container Setup (für neue Websites)
```bash
# Auf minicon-web:
mkdir -p /opt/sites/<name>
docker run -d \
  --name static-sites-<name> \
  --network web \
  --restart unless-stopped \
  -v /opt/sites/<name>:/usr/share/nginx/html:ro \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.<name>.rule=Host(\`<name>.minicon.eu\`)" \
  -l "traefik.http.routers.<name>.entrypoints=websecure" \
  -l "traefik.http.routers.<name>.tls.certresolver=cloudflare" \
  -l "traefik.http.services.<name>.loadbalancer.server.port=80" \
  nginx:alpine
```

## DNS (Cloudflare)
- Subdomain `<name>.minicon.eu` → CNAME zu `minicon.eu` (bereits Wildcard?)
- Falls nicht: A-Record auf 91.98.30.140

## Pipeline pro Website
1. **Recherche** — Echte Kontaktdaten sammeln (Gemini/web_fetch)
2. **Brief** — `website-briefs/<name>.md` nach TEMPLATE.md erstellen
3. **Bilder** — `generate-website-images.ps1` ausführen
4. **Entwicklung** — claude-code baut Website nach diesem Guide
5. **Review** — Daten verifizieren, keine Fake-Inhalte
6. **Deploy** — `deploy-static-site.ps1`
7. **QA** — Website testen (Links, Mobile, Impressum)
8. **Jira** — Ticket auf "Fertig" setzen

## Qualitätskriterien (bevor "Fertig")
- [ ] Alle Kontaktdaten sind echt und verifiziert
- [ ] Telefonnummer funktioniert als `tel:` Link
- [ ] Impressum + Datenschutz vorhanden
- [ ] Mobile-Ansicht funktioniert
- [ ] Keine Console-Errors
- [ ] Bilder laden korrekt
- [ ] Post-Deploy-Checks bestanden
