$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))

# Get DORF project info
$result = Invoke-RestMethod -Uri "https://minicon.atlassian.net/rest/api/3/project/DORF" -Headers @{
    "Authorization" = "Basic $b"
    "Content-Type" = "application/json"
}

$result | ConvertTo-Json -Depth 10
