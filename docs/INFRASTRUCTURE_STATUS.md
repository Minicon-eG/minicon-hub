# Minicon Infrastructure Status
## Stand: 21.03.2026

### ✅ Aktive Services

| Service | URL | Status |
|---------|-----|--------|
| Hauptseite | www.minicon.eu | ✅ |
| Kundenportal | mein.minicon.eu | ✅ |
| Kundenportal API | api.mein.minicon.eu | ✅ |
| Website Service API | api.minicon.eu | ✅ |
| Test-Site | test-site.minicon.eu | ✅ |
| Preview TV Dahn | preview-tv-dahn.minicon.eu | ✅ |

### 🔧 Heutige Fixes

1. **Traefik Route Repariert**
   - minicon-eu Route → static-sites-minicon-eu-1:80
   - website-service → minicon-website-service:4000

2. **Preview-Sites Priorität behoben**
   - Wildcard priority auf 1 gesetzt
   - Spezifische Preview-Routen haben jetzt Vorrang

3. **CORS behoben**
   - mein.minicon.eu zur whitelist hinzugefügt
   - access-control-allow-origin Header korrekt

4. **Kundenportal API Container**
   - Läuft auf Port 3000
   - Netzwerk: web + hub-internal

### 📋 Container (Docker)

- minicon-website-service (Port 4000)
- kundenportal-api (Port 3000)
- kundenportal (Cloudflare Pages)
- traefik
- hub-mongo

### 🌐 Traefik Routes (wichtig)

- api.minicon.eu → website-service:4000
- api.mein.minicon.eu → kundenportal-api:3000
- mein.minicon.eu → Cloudflare Pages
- www.minicon.eu → static-sites-minicon-eu-1:80

### 🔑 API Keys

- website-service: ADMIN_API_KEY=atlas-admin-2026

### 📝 Confluence

- Space: MINICON (ID 835813377)
- Virtuelles Krankenhaus: Page ID 853540865
