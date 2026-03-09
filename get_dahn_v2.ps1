$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== Testing Alternative Jira Endpoints ==="

# Try v2 API
$endpoints = @(
    'https://minicon.atlassian.net/rest/api/2/search?jql=project=DAHN&maxResults=20',
    'https://minicon.atlassian.net/rest/agile/1.0/board',
    'https://minicon.atlassian.net/rest/api/3/issues/picker?query=DAHN'
)

foreach ($endpoint in $endpoints) {
  Write-Host "`nTesting: $endpoint"
  try {
    $resp = Invoke-WebRequest -Uri $endpoint -Headers $headers -ContentType 'application/json'
    Write-Host "  Status: $($resp.StatusCode) - OK"
  } catch {
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__) - $($_.Exception.Message)"
  }
}
