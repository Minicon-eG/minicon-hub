$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

try {
  # Use POST with jql in body instead of query param
  $body = @{
    jql = "project = DAHN"
    maxResults = 50
  } | ConvertTo-Json
  
  $uri = 'https://minicon.atlassian.net/rest/api/3/search'
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers -Method POST -Body $body -ContentType 'application/json'
  $json = $resp.Content | ConvertFrom-Json
  Write-Host "=== DAHN Jira Status ($(Get-Date -Format 'yyyy-MM-dd HH:mm')) ==="
  Write-Host "Found $($json.issues.Count) issues"
  $json.issues | ForEach-Object {
    Write-Host "  [$($_.key)] $($_.fields.summary) | Status: $($_.fields.status.name)"
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
