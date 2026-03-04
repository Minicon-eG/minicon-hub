$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

# Test Jira
Write-Host "=== JIRA ==="
try {
    $projects = Invoke-RestMethod -Uri "https://minicon.atlassian.net/rest/api/3/project" -Headers @{
        "Authorization" = "Basic $b"
        "Content-Type" = "application/json"
    }
    Write-Host "Jira OK - $($projects.Count) Projekte"
} catch { Write-Host "Jira FEHLER: $_" }

# Test Confluence
Write-Host "=== CONFLUENCE ==="
try {
    $spaces = Invoke-RestMethod -Uri "https://minicon.atlassian.net/wiki/rest/api/space" -Headers @{
        "Authorization" = "Basic $b"
        "Content-Type" = "application/json"
    }
    Write-Host "Confluence OK - $($spaces.results.Count) Spaces"
} catch { Write-Host "Confluence FEHLER: $_" }

# Test Jira Issue Create
Write-Host "=== JIRA ISSUE CREATE ==="
try {
    $body = @{
        fields = @{
            project = @{ key = "DAHN" }
            summary = "Test-Ticket Atlas"
            issuetype = @{ name = "Task" }
        }
    } | ConvertTo-Json -Depth 5
    $issue = Invoke-RestMethod -Uri "https://minicon.atlassian.net/rest/api/3/issue" -Method POST -Headers @{
        "Authorization" = "Basic $b"
        "Content-Type" = "application/json"
    } -Body $body
    Write-Host "Issue erstellt: $($issue.key)"
} catch { Write-Host "Issue Create FEHLER: $_" }
