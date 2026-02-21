# Autonome Website-Deployment-Plattform - Systemdokumentation

## 1. Überblick
Die **Autonome Deployment-Plattform** ist ein vollautomatisiertes System, das lokale Unternehmen entdeckt, ihre Webpräsenz analysiert, moderne, rechtskonforme Websites generiert und auf Produktions-Subdomains (`*.minicon.eu`) bereitstellt.

**Ziel:** Eine End-to-End "Web-Agentur auf Autopilot".

## 2. Architektur & Arbeitsablauf

Das System arbeitet als Pipeline autonomer intelligenter Agenten.

### Systemarchitektur
Das folgende Diagramm veranschaulicht die hybride Architektur zwischen der lokalen Entwicklungsumgebung (wo Agenten laufen) und dem Produktionsserver (wo Daten und Websites liegen).

```text
+-------------------------------------------------------+           +-------------------------------------------------------+
|           LOKALE ENTWICKLUNGSUMGEBUNG (DEV)           |           |              PRODUKTIONSSERVER (HETZNER)              |
|                                                       |           |                                                       |
|   +-----------------------------------------------+   |           |   +-----------------------------------------------+   |
|   |  OpenClaw Agenten (Gemini)                    |   |           |   |  Infrastruktur (Docker)                       |   |
|   |                                               |   |           |   |                                               |   |
|   |  [🔎 Discovery] --> [⚖️ Analysis]             |   |           |   |  [🌐 Traefik Reverse Proxy]                   |   |
|   |         |                 |                   |   |           |   |             |                                 |   |
|   |         v                 v                   |   |           |   |             v                                 |   |
|   |  [✍️ Content]   --> [🏗️ Deployment]           |   |           |   |  [🖥️ Minicon Hub (Next.js)]                  |   |
|   |                                               |   |           |   |             |                                 |   |
|   +-----------+-----------------------------------+   |           |   +-------------+---------------------------------+   |
|               |                                       |           |                 |                                     |
|               | (Schreibt Daten via Tunnel)           |           |                 | (Liest Daten lokal)                 |
|               v                                       |           |                 v                                     |
|   +-----------+-----------+                           |           |   +-------------+-------------+                       |
|   |  SSH Tunnel (:27018)  | ----------------------------------------> |  MongoDB (:27017)         |                       |
|   +-----------------------+                           |           |   +---------------------------+                       |
+-------------------------------------------------------+           +-------------------------------------------------------+
```

### Autonomer Pipeline-Prozess
Der logische Datenfluss von der Entdeckung bis zur Live-Website.

```text
ZEITRAHMEN: Alle 2 Stunden (Cronjob)

1. ENTDECKUNG 🔎
   [OpenStreetMap] --(Daten)--> [Discovery Agent] --(Neu)--> [Datenbank: Status 'Analyzing']

2. ANALYSE ⚖️
   [Datenbank] --(Pending)--> [Analysis Agent] --(Crawl)--> [Website Check (SSL/Recht)]
                                      |
                                      +--(Score)--> [Datenbank: Status 'Analyzed']

3. GENERIERUNG ✍️
   [Datenbank] --(Analyzed)--> [Content Agent] --(AI)--> [Texte & Logo]
                                      |
                                      +--(Content)--> [Datenbank: Status 'ContentReady']

4. DEPLOYMENT 🏗️
   [Datenbank] --(Ready)--> [Deployment Agent] --(Build)--> [Status 'Live']
                                      |
                                      +--(URL)--> [ https://kunde.minicon.eu ]
```

### Agenten-Orchestrierung & Laufzeitumgebung 🧠

Die Intelligenz der Plattform ist strikt von der Produktionsinfrastruktur getrennt.

*   **Orchestrator:** **OpenClaw** (führt die `Gemini` Agenten-Session aus).
    *   OpenClaw verwaltet Status, Speicher und Aufgabenverteilung.
    *   Es nutzt interne **Cronjobs**, um Pipelines alle 2 Stunden zu triggern.
*   **Laufzeitumgebung:** **Lokale Entwicklungsumgebung** (Dev Server / Workstation).
    *   **Sicherheitsrichtlinie:** KI-Agenten laufen NICHT auf dem Produktionsserver (`minicon-web`), um die Angriffsfläche und Ressourcenlast zu minimieren.
    *   **Konnektivität:** Agenten verbinden sich mit der Produktions-MongoDB über einen sicheren **SSH-Tunnel** (Port 27018 -> 27017).
*   **Warum diese Architektur?**
    1.  **Sicherheit:** Produktionsschlüssel und Agentenlogik bleiben fern vom öffentlichen Webserver.
    2.  **Performance:** Rechenintensive KI-Prozesse (LLM-Aufrufe, Scraping) finden extern statt und verlangsamen keine Kundenwebsites.
    3.  **Kontrolle:** Human-in-the-loop Validierung ist in der Dev-Umgebung einfacher.

### Phase 1: Entdeckung (Der Scout) 🕵️‍♂️
*   **Agent:** `Discovery Agent`
*   **Quelle:** OpenStreetMap (Overpass API)
*   **Ziel:** Lokale Unternehmen (Restaurants, Handwerker, Einzelhandel) in einer bestimmten Region (z.B. Dahn).
*   **Aktion:**
    *   Ruft Echtdaten ab (Name, Adresse, Branche).
    *   Prüft auf bestehende Webseiten.
    *   Erstellt einen `Company`-Eintrag in der MongoDB-Datenbank.

### Phase 2: Analyse (Der Auditor) ⚖️
*   **Agent:** `Analysis Agent`
*   **Aktion:**
    *   **Technik-Check:** SSL, Mobile Responsiveness, SEO-Score.
    *   **Rechts-Check:** Scannt nach "Impressum", "Datenschutzerklärung" (DSGVO) und "Cookie Banner".
    *   **Bewertung:** Berechnet einen Score von 0-100. Fehlende rechtliche Seiten führen zu massiven Abzügen.
*   **Output:** `WebsiteAnalysis`-Eintrag.

### Phase 3: Content-Generierung (Der Schöpfer) ✍️
*   **Agent:** `Generation Agent`
*   **Aktion:**
    *   **Inhalt:** Generiert AIDA-strukturierten Text (Hero, Features, Über uns), angepasst an die Branche.
    *   **Rechtliches:** Generiert spezifische Rechtstexte (Impressum, Datenschutz, AGB) basierend auf Firmendaten.
    *   **Design:** Erstellt Prompts für Logos und definiert Farbschemata.
*   **Output:** `GeneratedContent`-Eintrag.

### Phase 4: Konstruktion (Der Baumeister) 🏗️
*   **Agent:** `Repo Builder Agent`
*   **Prinzip:** "Kontext-Sensitiver Relaunch" – Wir bauen keine leeren Hüllen, sondern intelligente Upgrades.
*   **Logik:**
    1.  **Kontext-Analyse:** Der Agent lädt die komplette `WebsiteAnalysis` (Stärken, Schwächen, rechtliche Mängel).
    2.  **Content-Recycling:**
        *   *Existierende Website:* Alle auffindbaren Texte (Über uns, Leistungen, Kontakt) werden gescrapt, aufbereitet und in das neue Layout integriert.
        *   *Keine Website:* Hochwertige KI-Texte werden basierend auf Branche und Name generiert.
    3.  **Modernisierung:** Das Layout wird komplett modernisiert (Mobile-First, Tailwind), aber mit Bezug zur alten Identität (falls vorhanden/gewünscht).
    4.  **Problembehebung:** Identifizierte Mängel (z.B. fehlendes Impressum) werden automatisch durch generierte Rechtstexte behoben.
*   **Ablauf (Technisch):**
    1.  **Clone:** Klont das `website-template` (Next.js Boilerplate).
    2.  **Inject:** Schreibt die intelligent kombinierten Inhalte (Alt + Neu) in den Code.
    3.  **Create:** Erstellt ein neues privates Repository auf GitHub: `Minicon-eG/website-[kunde]`.
    4.  **Push:** Überträgt den fertigen Code.

### Phase 5: Deployment (Die Container-Werft) 🚀
*   **CI/CD:**
    *   Jedes Kunden-Repo hat eine GitHub Action.
    *   Baut den Container -> Pusht nach GHCR (`ghcr.io/minicon-eg/website-[kunde]`).
*   **Produktion:**
    *   Der Server (`minicon-web`) zieht das neue Image.
    *   Ein Eintrag wird (automatisch) zur `docker-compose.yml` hinzugefügt.
    *   Traefik routet `[kunde].minicon.eu` auf den dedizierten Container.

### Phase 6: Verifikation & Quality Assurance (QA) ✅
*   **Grundsatz:** "Ein Deployment ist erst abgeschlossen, wenn der Link funktioniert."
*   **Ablauf:**
    1.  **Container-Check:** Läuft der Container (`docker ps`)?
    2.  **Route-Check:** Liefert `curl https://[kunde].minicon.eu` einen HTTP 200 OK?
    3.  **Datenbank-Sync:** Stimmt die `liveUrl` im `Deployment`-Record mit der echten URL überein?
    4.  **Hub-Refresh:** Cache des Hubs leeren, damit der neue Link sichtbar wird.

### Phase 7: Vertrieb (Der Verkäufer) 💼
*   **Agent:** `Sales Agent`
*   **Aktion:** Generiert personalisierte Pitch-E-Mails, die sich auf spezifische Analyseergebnisse beziehen (z.B. "Ihrer Seite fehlt ein Cookie-Banner").

## 3. Datenmodell (MongoDB/Prisma)

*   **Company:** Stammdaten (Name, Domain, Adresse).
*   **WebsiteAnalysis:** Audit-Ergebnisse & Score.
*   **GeneratedContent:** KI-geschriebene Texte, Design-Assets und Strukturdefinitionen.
*   **Deployment:** Statusverfolgung (Warteschlange -> Live) und URL.

## 4. Betriebsrichtlinien

*   **Autonomie:** Agenten laufen in der Entwicklungsumgebung und pushen Daten über einen sicheren Tunnel in die Produktions-MongoDB.
*   **Updates:** Der Hub (`hub.minicon.eu`) spiegelt den Live-Status der Datenbank wider.
*   **Compliance First:** Keine Website geht ohne gültiges Impressum und Datenschutzerklärung online.

## 5. Zukünftige Roadmap
*   **Zahlungsintegration:** Automatisierter Stripe-Checkout für Kunden, um ihre Seite zu "beanspruchen".
*   **Repo Eject:** Automatisierte Erstellung eines eigenständigen GitHub-Repositories für zahlende Kunden.
