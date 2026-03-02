# Cron Setup - Hybrid Architecture

**Stand: 25. Februar 2026**

## Übersicht

Wir nutzen einen **Hybrid-Ansatz**:
- 🖥️ **Server-Cron:** Einfache Tasks ohne Agent (Discovery, DB-Checks)
- 🤖 **OpenClaw-Cron:** Agent-basierte Tasks (Analyse, Deployment, DAHN)

---

## Server-Cron (minicon-web)

**Location:** `/opt/scripts/server-discovery-cron.sh`

### Einträge in crontab

```bash
# Hub Auto-Deploy (alle 4 Stunden)
0 */4 * * * docker pull nitr0n/minicon-hub:latest >> /var/log/hub-deploy.log 2>&1 && docker stop minicon-hub >> /var/log/hub-deploy.log 2>&1 && docker rm minicon-hub >> /var/log/hub-deploy.log 2>&1 && /tmp/deploy-hub.sh >> /var/log/hub-deploy.log 2>&1

# Discovery (täglich 8:00 Uhr)
0 8 * * * /opt/scripts/server-discovery-cron.sh >> /var/log/discovery-cron.log 2>&1
```

### Discovery Script

**Was es macht:**
```bash
docker exec minicon-hub node run-discovery.js
```

1. Ruft Overpass API (OpenStreetMap)
2. Findet neue Restaurants in Dahn
3. Speichert in MongoDB (minicon-db)
4. **Kein Agent nötig!** (nur API + DB)

**Warum auf dem Server:**
- ✅ Direkter Zugriff auf `minicon-db` (kein SSH-Tunnel)
- ✅ Replica Set funktioniert zuverlässig
- ✅ Schneller & stabiler

**Logs:**
```bash
ssh root@91.98.30.140
tail -f /var/log/discovery-cron.log
```

---

## OpenClaw-Cron (lokal)

**Location:** OpenClaw Gateway

### 1. DAHN Pipeline - Daily Workflow

**Schedule:** Täglich 9:00 Uhr

**Was es macht:**
- Prüft Jira DAHN-Tickets
- Findet Firmen OHNE Website (hohe Priorität)
- Generiert Zusammenfassung
- Postet an Hub API

**Braucht Agent:** ✅ JA (Jira-Analyse, Text-Generierung)

**Läuft:** Lokal via OpenClaw (isolated session)

---

### 2. Autonomous Deployment Check (VERALTET)

**Schedule:** Alle 2 Stunden

**Status:** ⚠️ Läuft noch, aber **Discovery ist deaktiviert** (läuft jetzt auf Server)

**Was es macht:**
- ✅ Status-Check (Companies, Analyses, Deployments)
- ❌ Discovery (schlägt fehl - ist OK, läuft auf Server)

**Zeigt nur:** 11 Companies (lokal, veraltet)

**TODO:** Evtl. ersetzen durch reinen "Status Monitor" oder deaktivieren.

---

## Workflow: Neue Company entdecken bis Live

### 1. **Discovery** (Server-Cron, täglich 8:00)
```
Overpass API → run-discovery.js → MongoDB (minicon-db)
```
**Output:** Neue Companies in DB (z.B. 30 statt 11)

### 2. **Analyse** (manuell oder Agent)
```
Agent liest Company → Website-Analyse → Content-Generierung
```
**Braucht:** OpenClaw Agent

### 3. **Deployment** (manuell oder Agent)
```
Agent → Docker Build → Docker Push → Server Pull → Live
```
**Braucht:** OpenClaw Agent

---

## Warum Hybrid?

### Server-Cron (ohne Agent):
✅ Discovery braucht **keinen Agent** (nur API + DB)  
✅ Direkter DB-Zugriff (kein SSH-Tunnel)  
✅ Läuft zuverlässig & schnell  

### OpenClaw-Cron (mit Agent):
✅ Analyse braucht **Agent** (Content generieren)  
✅ Deployment braucht **Agent** (Website bauen)  
✅ DAHN braucht **Agent** (Jira interpretieren)  

**Best of both worlds!** 🎯

---

## Monitoring

### Server-Cron Logs:
```bash
ssh root@91.98.30.140
tail -f /var/log/discovery-cron.log
```

### OpenClaw-Cron Status:
```bash
cron list
```

### Company Count (Production):
```bash
ssh root@91.98.30.140
docker exec hub-mongo mongosh minicon-hub --eval "db.Company.countDocuments()"
```

---

## Troubleshooting

### Problem: Discovery findet keine neuen Companies

**Check:**
```bash
ssh root@91.98.30.140
/opt/scripts/server-discovery-cron.sh
```

**Logs:**
```bash
cat /var/log/discovery-cron.log
```

### Problem: OpenClaw Cron zeigt nur 11 Companies

**Normal!** Der lokale Cron sieht nur die lokale (veraltete) DB.  
Production-Daten sind auf dem Server (30+ Companies).

### Problem: Discovery schlägt fehl (Replica Set)

**Auf dem Server?** → Prüfe ob `minicon-db` als Replica Set läuft:
```bash
docker exec hub-mongo mongosh --eval "rs.status()"
```

**Lokal?** → Normal, nutze Server-Cron für Discovery!

---

**Zuletzt aktualisiert:** 25. Februar 2026  
**Maintainer:** Gemini 💎
