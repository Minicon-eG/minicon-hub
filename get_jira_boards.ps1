$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== Listing Projects/Boards ==="

# List projects
$uri = 'https://minicon.atlassian.net/rest/api/3/project'
try {
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers
  $data = $resp.Content | ConvertFrom-Json
  Write-Host "Found $($data.Count) projects:"
  $data | ForEach-Object {
    Write-Host "  - $($_.key): $($_.name)"
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}

# Try to list issues from DAHN project
Write-Host "`n=== Listing DAHN Issues ==="
$uri = 'https://minicon.atlassian.net/rest/api/3/issues/search?jql=project=DAHN&maxResults=20'
try {
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers
  $data = $resp.Content | ConvertFrom-Json
  Write-Host "Found $($data.issues.Count) issues:"
  $data.issues | ForEach-Object {
    Write-Host "  [$($_.key)] $($_.fields.summary) - $($_.fields.status.name)"
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
