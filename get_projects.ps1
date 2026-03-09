$username = 'michael.nikolaus@minicon.eu'
$token = 'ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40'
$credPair = "$username`:$token"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{'Authorization'="Basic $encodedCreds"; 'Accept'='application/json'}

Write-Host "=== All Projects with Issue Count ==="

# Get all projects
$uri = 'https://minicon.atlassian.net/rest/api/3/project?expand=projectCategory'
try {
  $resp = Invoke-WebRequest -Uri $uri -Headers $headers
  $data = $resp.Content | ConvertFrom-Json
  
  $data | ForEach-Object {
    $projectKey = $_.key
    Write-Host "`nProject: $($_.name) ($projectKey)"
    
    # Get issue count for each project
    try {
      $issueUri = "https://minicon.atlassian.net/rest/api/3/issues/search?jql=project=$projectKey&maxResults=1"
      $issueResp = Invoke-WebRequest -Uri $issueUri -Headers $headers -ErrorAction SilentlyContinue
      if ($issueResp.StatusCode -eq 200) {
        $issueData = $issueResp.Content | ConvertFrom-Json
        Write-Host "  Issues: $($issueData.total)"
      }
    } catch {
      # Endpoint may not exist, continue
    }
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
