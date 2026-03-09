$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== Testing Jira API Connectivity ==="

# Test serverInfo
$uri = 'https://minicon.atlassian.net/rest/api/3/serverInfo'
try {
  Write-Host "Testing: $uri"
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers
  $data = $resp.Content | ConvertFrom-Json
  Write-Host "OK - Jira API is reachable"
  Write-Host "Version: $($data.version)"
  Write-Host "BaseUrl: $($data.baseUrl)"
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  Write-Host "StatusCode: $($_.Exception.Response.StatusCode.value__)"
}
