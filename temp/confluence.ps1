$env:CLOUDFLARE_API_KEY = "d8b4b6f644c3de1b2573d26027278fd8f4cbb"
$env:CLOUDFLARE_EMAIL = "michael.nikolaus@minicon.eu"

$body = @{
    spaceId = "MINICON"
    title = "app.dokukiste.de Zugangsdaten"
    body = @{
        storage = @{
            value = "<h1>app.dokukiste.de Zugangsdaten</h1><p><strong>URL:</strong> https://app.dokukiste.de</p><table><tr><th>Benutzer</th><th>Passwort</th></tr><tr><td>admin</td><td>dokukiste</td></tr></table><p><em>Letzte Aenderung: 23.02.2026</em></p>"
            representation = "storage"
        }
    }
} | ConvertTo-Json -Depth 5

$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/wiki/rest/api/content" -Method POST -Headers @{
    "X-Auth-Email" = $env:CLOUDFLARE_EMAIL
    "X-Auth-Key" = $env:CLOUDFLARE_API_KEY
    "Content-Type" = "application/json"
} -Body $body

$result | ConvertTo-Json -Depth 10
