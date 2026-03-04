$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

# Create page in DORF space
$body = @{
    space = @{ key = "DORF" }
    title = "Website-Automatisierung Pipeline"
    body = @{
        storage = @{
            value = "<h1>Website-Automatisierung Pipeline</h1>

<h2>Ziel</h2>
<p>Automatisierte Erstellung von Webseiten fuer lokale Unternehmen unter minicon.eu Subdomains.</p>

<h2>Pipeline-Schritte</h2>
<ol>
<li><strong>Google Maps Recherche</strong> - Potenzielle Kunden identifizieren</li>
<li><strong>Template-System</strong> - Standard-Templates vorbereiten</li>
<li><strong>Automatische Generierung</strong> - Website aus Daten erstellen</li>
<li><strong>Cloudflare Tunnel Setup</strong> - Oeffentliche URL bereitstellen</li>
<li><strong>Akquise</strong> - Kunden kontaktieren und verkaufen</li>
</ol>

<h2>Ticket-Struktur (pro Website)</h2>
<p>Jede Website hat ein Jira-Ticket mit folgenden Feldern:</p>
<ul>
<li><strong>Analyse</strong> - Google Maps Daten, Bewertungen, Konkurrenz</li>
<li><strong>Entwicklung</strong> - Template-Anpassung, Inhalte</li>
<li><strong>Deployment</strong> - Server, Tunnel, DNS</li>
<li><strong>Status</strong> - Analyse / In Entwicklung / Live / Akquise</li>
</ul>

<h2>Website-Liste</h2>
<table>
<tr><th>#</th><th>Website</th><th>Subdomain</th><th>Status</th><th>Ticket</th></tr>
<tr><td>1</td><td>Paelzer Schdubb</td><td>schdubb.minicon.eu</td><td>Live</td><td>WEB-1</td></tr>
<tr><td>2</td><td>Weitere...</td><td></td><td>Roadmap</td><td></td></tr>
</table>

<p><em>Stand: 23.02.2026</em></p>"
            representation = "storage"
        }
    }
} | ConvertTo-Json -Depth 5

$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/wiki/rest/api/content" -Method POST -Headers @{
    "Authorization" = "Basic $b"
    "Content-Type" = "application/json"
} -Body $body

$result | ConvertTo-Json -Depth 10
