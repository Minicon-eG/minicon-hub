$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== DAHN Board Issues (Agile API) ==="

# Get boards
$uri = 'https://minicon.atlassian.net/rest/agile/1.0/board'
try {
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers
  $data = $resp.Content | ConvertFrom-Json
  Write-Host "Found $($data.values.Count) boards"
  $data.values | ForEach-Object {
    Write-Host "  - $($_.name) (ID: $($_.id), Project: $($_.projectKey))"
  }
  
  # Get DAHN board specifically
  $dahnBoard = $data.values | Where-Object { $_.projectKey -eq 'DAHN' }
  if ($dahnBoard) {
    Write-Host "`n=== DAHN Board Issues ==="
    $boardId = $dahnBoard.id
    $issuesUri = "https://minicon.atlassian.net/rest/agile/1.0/board/$boardId/issue?maxResults=50"
    $issuesResp = Invoke-WebRequest -Uri $issuesUri -Headers $headers
    $issuesData = $issuesResp.Content | ConvertFrom-Json
    Write-Host "Issues: $($issuesData.issues.Count)"
    $issuesData.issues | ForEach-Object {
      Write-Host "  [$($_.key)] $($_.fields.summary)"
      Write-Host "    Status: $($_.fields.status.name)"
    }
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
