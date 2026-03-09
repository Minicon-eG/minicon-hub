$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== DAHN Project Status ==="

# Use the search endpoint with POST
$uri = 'https://minicon.atlassian.net/rest/api/3/search'
$body = @{
    jql = 'project = DAHN AND statusCategory != Done'
    maxResults = 30
    fields = @('summary', 'status', 'assignee', 'updated')
} | ConvertTo-Json

try {
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers -Method POST -Body $body -ContentType 'application/json'
  $data = $resp.Content | ConvertFrom-Json
  Write-Host "Active Issues: $($data.issues.Count)"
  if ($data.issues.Count -gt 0) {
    $data.issues | ForEach-Object {
      $assignee = if ($_.fields.assignee) { $_.fields.assignee.displayName } else { 'Unassigned' }
      Write-Host "  [$($_.key)] $($_.fields.summary)"
      Write-Host "    Status: $($_.fields.status.name) | Assignee: $assignee"
    }
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
