$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

# Create WEB project
$body = @{
    key = "WEB"
    name = "Website Automatisierung"
    projectTypeKey = "software"
    templateKey = "com.atlassian.jira-core-project-templates:jira-core-task-management"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/rest/api/3/project" -Method POST -Headers @{
    "Authorization" = "Basic $b"
    "Content-Type" = "application/json"
} -Body $body

$result | ConvertTo-Json -Depth 10
