$env:ATLASSIAN_API_TOKEN = "ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"
$env:JIRA_USERNAME = "michael.nikolaus@minicon.eu"

# Create Confluence page
npx ts-node C:\Working\openclaw-src\openclaw\skills\atlassian\atlassian-client.ts create-page "MINICON" "app.dokukiste.de Zugangsdaten" "<h1>app.dokukiste.de Zugangsdaten</h1><p><strong>URL:</strong> https://app.dokukiste.de</p><table><tr><th>Benutzer</th><th>Passwort</th></tr><tr><td>admin</td><td>dokukiste</td></tr></table><p><em>Letzte Aenderung: 23.02.2026</em></p>"
