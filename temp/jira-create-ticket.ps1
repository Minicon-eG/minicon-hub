$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

# Simple ticket
$body = @{
    fields = @{
        project = @{ id = "10040" }
        summary = "[Website] Paelzer Schdubb - Live"
        description = "Status: LIVE

Analyse: Google Maps 529 Bewertungen
Entwicklung: Template Next.js
Deployment: schdubb.minicon.eu
Akquise: Nicht gestartet"
        issuetype = @{ id = "10001" }
    }
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/rest/api/3/issue" -Method POST -Headers @{
    "Authorization" = "Basic $b"
    "Content-Type" = "application/json"
} -Body $body

$result | ConvertTo-Json
