# Minicon Hub - Architecture

## Production vs. Development

**Stand: 25. Februar 2026**

### ⚠️ Wichtig: EINE Production-Datenbank

Wir nutzen **EINE zentrale Production-DB auf dem Server**. Lokale Entwicklung nutzt SQLite.

---

## Production (Server: minicon-web)

**Server:** 91.98.30.140

### Components

| Component | Container | Port | Status |
|-----------|-----------|------|--------|
| **MongoDB** | `hub-mongo` | 27017 | Replica Set "rs0" |
| **Hub** | `minicon-hub` | 3000 | Next.js App |
| **Traefik** | `traefik` | 80/443 | Reverse Proxy |

### Database

- **Name:** minicon-hub
- **Type:** MongoDB 7.0
- **Replica Set:** rs0
- **Member:** minicon-db:27017
- **Connection:** `mongodb://minicon-db:27017/minicon-hub?replicaSet=rs0&authSource=admin`
- **Companies:** 30+ (Live Data)

### Cron Jobs

Alle Cron-Jobs laufen **auf dem Server** (nicht lokal):

1. **Autonomous Deployment Check** - alle 2h
2. **Discovery Agent** - täglich (findet neue Restaurants via OpenStreetMap)
3. **Deployment Agent** - bei Bedarf

### Warum auf dem Server?

✅ Direkter Zugriff zur Production-DB
✅ Keine SSH-Tunnel nötig
✅ Stabil & zuverlässig
✅ Daten bleiben auf dem Server

---

## Local Development (C:\working\minicon-hub)

### Database

- **Type:** SQLite
- **File:** `dev.db`
- **Companies:** Test-Daten (NICHT Production!)
- **Connection:** `file:./dev.db`

### .env Configuration

```env
# Local Development: SQLite
DATABASE_URL="file:./dev.db"

# Production (Server only): MongoDB Replica Set
# DATABASE_URL="mongodb://minicon-db:27017/minicon-hub?replicaSet=rs0&authSource=admin"
```

### Warum SQLite lokal?

✅ Schnell & einfach (keine MongoDB Installation nötig)
✅ Keine Replica Set Komplexität
✅ Kein Risiko für Production-Daten
✅ Perfekt für Entwicklung & Testing

### Production-Daten lesen (Read-Only)

Wenn du Production-Daten anschauen willst:

```bash
# SSH auf Server
ssh root@91.98.30.140

# Prisma Studio starten
docker exec -it minicon-hub npx prisma studio

# Im Browser öffnen: http://localhost:5555
```

---

## Warum KEINE SSH-Tunnel für MongoDB Replica Set?

❌ **Problem:**
- MongoDB Replica Set über SSH-Tunnel ist fehleranfällig
- Member-Namen (minicon-db) können lokal nicht aufgelöst werden
- `directConnection=true` umgeht wichtige Features
- Transaktionen funktionieren nicht zuverlässig

✅ **Lösung:**
- Production bleibt auf Server
- Local nutzt SQLite für Development
- Klare Trennung: Server = Prod, Local = Dev

---

## Deployment Workflow

### 1. Local Development

```bash
# Entwicklung mit SQLite
npm run dev

# Test-Daten einfügen
npx prisma studio
```

### 2. Testing

```bash
# Build testen
npm run build

# Production-Build lokal starten
npm start
```

### 3. Deployment auf Server

```bash
# Docker Image bauen
docker build -t nitr0n/minicon-hub:latest .

# Zu Docker Hub pushen
docker push nitr0n/minicon-hub:latest

# Auf Server deployen
ssh root@91.98.30.140
docker pull nitr0n/minicon-hub:latest
docker restart minicon-hub
```

---

## Wichtige Befehle

### Server

```bash
# SSH verbinden
ssh root@91.98.30.140

# Logs anschauen
docker logs minicon-hub -f
docker logs hub-mongo -f

# DB Status
docker exec hub-mongo mongosh --eval "rs.status()"

# Company Count
docker exec hub-mongo mongosh minicon-hub --eval "db.Company.countDocuments()"

# Discovery manuell triggern
docker exec minicon-hub node run-discovery.js
```

### Local

```bash
# Development Server
npm run dev

# Prisma Studio (SQLite)
npx prisma studio

# Schema ändern
npx prisma db push
```

---

## Troubleshooting

### Problem: "Prisma needs Replica Set"

**Ursache:** Lokale .env zeigt auf MongoDB ohne Replica Set

**Lösung:** `.env` auf SQLite setzen:
```env
DATABASE_URL="file:./dev.db"
```

### Problem: Server-Disk voll (100%)

**Symptom:** MongoDB crashed, Restart-Loop

**Lösung:**
```bash
ssh root@91.98.30.140
docker system prune -a -f --volumes
# Gibt ~4-5GB frei
```

### Problem: Discovery findet keine neuen Companies

**Ursache:** Overpass API Timeout

**Lösung:** `run-discovery-v2.js` nutzt besseres Timeout-Handling (60s)

---

## Architektur-Entscheidungen

### Warum MongoDB Replica Set?

Prisma benötigt Replica Sets für **Transaktionen** (ACID):
- Company-Creation ist eine Transaktion
- Verhindert Duplicate-Entries
- Garantiert Daten-Konsistenz

### Warum keine Shared DB (local + server)?

❌ Konflikte bei gleichzeitigem Zugriff
❌ Replica Set über SSH = kompliziert
❌ Risiko von Daten-Inkonsistenz

✅ Klare Trennung ist besser!

---

**Zuletzt aktualisiert:** 25. Februar 2026
**Maintainer:** Gemini 💎
