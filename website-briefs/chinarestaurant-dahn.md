# Website-Brief: Chinarestaurant Dahn

## 1. Unternehmen
- **Name:** Chinarestaurant Dahn (auch bekannt als Papavy Restaurant lt. OSM)
- **Branche:** Asiatisches Restaurant / Chinesische Küche
- **Standort:** Pirmasenser Straße 52, 66994 Dahn
- **Slogan/Tagline:** "Authentische asiatische Küche in Dahn"
- **USP:** Einziges chinesisch-asiatisches Restaurant an der Pirmasenser Straße in Dahn. Kein eigenes Web-Auftreten – Minicon-Präsenz als erste digitale Visitenkarte.
- **Website (bestehend):** Keine

## 2. Kontaktdaten (VERIFIZIERT)
- **Adresse:** Pirmasenser Straße 52, 66994 Dahn
- **Telefon:** 06391 838 9567 (Quelle: dasoertliche.de — tel: +496391838 9567 → +4963918389567)
- **E-Mail:** Nicht bekannt
- **Inhaber:** Nicht öffentlich bekannt
- **USt-IdNr:** Nicht bekannt

## 3. Öffnungszeiten
Laut OSM: keine Öffnungszeiten hinterlegt.
→ Auf Website: "Bitte rufen Sie uns an oder besuchen Sie uns — Öffnungszeiten auf Anfrage" angeben

**Hinweis:** OSM-Eintrag (way 223604888) trägt den Namen "Papavy Restaurant", Adresse identisch.
TripAdvisor-Rating: 4/5 Sterne aus 16 Bewertungen (Quelle: dasoertliche.de)

## 4. Google Maps
- **Koordinaten:** 49.1542363, 7.7730607
- **Google Maps Embed URL (Zwei-Klick-Consent Pflicht!):**
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.3!2d7.7730607!3d49.1542363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2zQ2hpbmFyZXN0YXVyYW50IERhaG4!5e0!3m2!1sde!2sde!4v1`

## 5. Echte Speisekarte
**WARNUNG: Keine echte Speisekarte online gefunden!**

Recherchiert (27.02.2026):
- OSM: kein `contact:website` / `extratags.website`  
- Das Örtliche: nur Adresse/Telefon
- Speisekarte.de: nicht gelistet
- Lieferando: nicht gelistet
- TripAdvisor: gesperrt für web_fetch
- 11880.com: nur als "Chinesisches Restaurant" gelistet, keine Speisekarte

→ **Lösung:** Auf der Website KEINE ausgedachten Gerichte/Preise! Stattdessen:
- Kategorie-Hinweise (Chinesische Küche, Wok-Gerichte, Dim Sum usw.) OHNE Preise
- Hinweis: "Unsere aktuelle Speisekarte erfragen Sie bitte direkt bei uns: Tel. 06391 838 9567"

## 6. Bilder
Keine echten Fotos auffindbar. KI-generierte Bilder via `generate-website-images.ps1`:
- Typ: `restaurant` mit asiatischem Fokus
- **Wichtig:** Custom Prompts für asiatisch/chinesisches Restaurant verwenden!
  - hero: "Chinesisches Restaurant Fassade Dahn, Abendbeleuchtung, asiatische Dekoration"
  - food-1: "Authentische chinesische Küche, Wok-Gerichte, knusprige Ente, Tisch in Restaurant"
  - food-2: "Dim Sum und Frühlingsrollen, authentisch chinesisch, professionelle Food-Fotografie"
  - interior: "Gemütliches chinesisches Restaurant-Interieur, rote Lampions, warme Beleuchtung"

## 7. Design-Richtung
- **Stil:** Modern-asiatisch, warm und einladend
- **Primärfarbe:** Tiefrot / Dunkelrot (#B22222 oder ähnlich)
- **Sekundärfarbe:** Gold / Dunkelgold (#C9A84C)
- **Akzentfarbe:** Schwarz (#1A1A1A)
- **Hintergrund:** Sehr dunkel (fast schwarz) für elegantes Asia-Restaurant-Feeling
- **Schriften:** System-Fonts (keine Google Fonts wegen DSGVO!) — z.B. Georgia für Überschriften, Arial/sans-serif für Text
- **Bildwelt:** Rote Lampions, Bambus-Motive, Wok-Gerichte, asiatisches Ambiente
- **Mood:** Elegant, exotisch, authentisch — aber zugänglich für deutsche Gäste

## 8. Website-Struktur
- **Hero:** Fullscreen mit Bild + "Willkommen im Chinarestaurant Dahn"
- **Über uns:** Kurze Beschreibung (asiatische Küche, lokales Restaurant)
- **Speisekarte:** Kategorien ohne Preise + Hinweis auf direkten Kontakt
- **Öffnungszeiten:** "Bitte telefonisch erfragen"
- **Kontakt & Anfahrt:** Adresse, Telefon, Google Maps (Zwei-Klick-Consent!)
- **Impressum & Datenschutz** (Pflicht!)

## 9. Subdomain & Deployment
- **Subdomain:** `china-dahn.minicon.eu`
- **Container-Name:** `static-sites-china-dahn-1`
- **Site-Pfad:** `/opt/sites/china-dahn/`
- **Source:** `C:\Working\chinarestaurant-dahn-website\out\`
- **Server:** minicon-web (91.98.30.140)

## 10. Jira
- **Ticket:** DAHN-13
- **Status:** In Arbeit

## 11. Notizen
- Name-Diskrepanz: "Chinarestaurant Dahn" (Das Örtliche, 11880) vs. "Papavy Restaurant" (OSM)
  → Website unter "Chinarestaurant Dahn" bauen (offizieller Name laut Telefonbuch)
- Kein Facebook / Instagram gefunden
- TripAdvisor vorhanden: https://www.tripadvisor.com/Restaurant_Review-g1085434-d7375036
