$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

$html = @"
<h1>Website-Automatisierung Pipeline</h1>

<h2>Vision</h2>
<p>Automatisierte Erstellung von Webseiten fuer lokale Unternehmen in Dahn und der Pfalz. Subdomains unter minicon.eu, spaeter eigene Domains. Ziel: 19+ Webseiten fuer lokale Firmen.</p>

<h2>Pipeline-Schritte</h2>
<table>
<tr><th>#</th><th>Schritt</th><th>Verantwortlich</th><th>Beschreibung</th></tr>
<tr><td>1</td><td>Google Maps Recherche</td><td>Gemini</td><td>Potenzielle Kunden identifizieren: Bewertungen, Kategorie, Kontaktdaten, Konkurrenz-Analyse</td></tr>
<tr><td>2</td><td>Analyse</td><td>Gemini</td><td>Hat die Firma eine Website? Qualitaet? Verbesserungspotenzial? Bewertungs-Score?</td></tr>
<tr><td>3</td><td>Template-Auswahl</td><td>Kalle</td><td>Passendes Template waehlen (Restaurant, Handwerk, Dienstleistung, etc.)</td></tr>
<tr><td>4</td><td>Generierung</td><td>Gemini/Kalle</td><td>Website aus Daten automatisch generieren (Next.js)</td></tr>
<tr><td>5</td><td>Review</td><td>Michael (PO)</td><td>Feedback und Freigabe durch Product Owner</td></tr>
<tr><td>6</td><td>Deployment</td><td>Atlas/Scotty</td><td>Server, DNS, Traefik-Route einrichten</td></tr>
<tr><td>7</td><td>Akquise</td><td>Michael</td><td>Kunden kontaktieren, Demo zeigen, verkaufen</td></tr>
</table>

<h2>Ticket-Struktur (Jira Projekt: DAHN)</h2>
<p>Jede Website bekommt ein <strong>Epic</strong> mit folgenden Sub-Tasks:</p>
<ul>
<li><strong>Analyse</strong> - Google Maps Daten, Bewertungen, Ist-Zustand Website</li>
<li><strong>Entwicklung</strong> - Template-Anpassung, Inhalte, Bilder</li>
<li><strong>Deployment</strong> - Server-Setup, DNS, SSL</li>
<li><strong>Akquise</strong> - Kontaktaufnahme, Demo, Vertrag</li>
</ul>

<h2>Rollen</h2>
<table>
<tr><th>Agent</th><th>Rolle</th><th>Aufgaben</th></tr>
<tr><td>Gemini</td><td>Recherche &amp; Generierung</td><td>Google Maps Analyse, Website-Generierung, Pipeline vorantreiben</td></tr>
<tr><td>Kalle</td><td>Frontend-Entwicklung</td><td>Templates, Anpassungen, Code-Reviews</td></tr>
<tr><td>Atlas</td><td>Projektmanagement</td><td>Tickets erstellen, delegieren, tracken</td></tr>
<tr><td>Scotty</td><td>DevOps</td><td>Deployment, DNS, Server</td></tr>
<tr><td>Michael</td><td>Product Owner</td><td>Review, Freigabe, Akquise</td></tr>
</table>

<h2>Zielkunden (Dahn/Pfalz)</h2>
<table>
<tr><th>#</th><th>Firma</th><th>Kategorie</th><th>Bewertungen</th><th>Status</th></tr>
<tr><td>1</td><td>Paelzer Schdubb</td><td>Restaurant</td><td>529</td><td>LIVE (schdubb.minicon.eu)</td></tr>
<tr><td>2-19</td><td>Weitere Restaurants/Firmen in Dahn</td><td>Diverse</td><td>-</td><td>Recherche</td></tr>
</table>

<h2>Technologie</h2>
<ul>
<li><strong>Framework:</strong> Next.js 15</li>
<li><strong>Hosting:</strong> minicon-web (91.98.30.140)</li>
<li><strong>Reverse Proxy:</strong> Traefik v3</li>
<li><strong>DNS:</strong> Cloudflare</li>
<li><strong>Domains:</strong> {firma}.minicon.eu (spaeter eigene)</li>
</ul>

<h2>Ablauf (taegliche Routine)</h2>
<ol>
<li>Atlas prueft DAHN-Board auf offene Tickets</li>
<li>Gemini fuehrt naechsten Pipeline-Schritt aus</li>
<li>Bei Fertigstellung: Ticket an naechsten Schritt weiterschieben</li>
<li>Bei Blocker: Michael informieren</li>
</ol>

<p><em>Stand: 23.02.2026 - Erstellt von Atlas</em></p>
"@

$body = @{
    space = @{ key = "MINICON" }
    title = "Website-Automatisierung Pipeline"
    type = "page"
    body = @{
        storage = @{
            value = $html
            representation = "storage"
        }
    }
} | ConvertTo-Json -Depth 5

$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/wiki/rest/api/content" -Method POST -Headers @{
    "Authorization" = "Basic $b"
    "Content-Type" = "application/json"
} -Body $body

Write-Host "Page erstellt: $($result.id) - $($result.title)"
Write-Host "URL: https://minicon.atlassian.net/wiki$($result._links.webui)"
