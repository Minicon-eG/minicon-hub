Write-Host "=== Checking Minicon Websites ==="

$websites = @(
    'https://minicon.eu',
    'https://hub.minicon.eu',
    'https://dahn.minicon.eu',
    'https://dorf.minicon.eu',
    'https://ag.minicon.eu',
    'https://pdfm.minicon.eu',
    'https://puic.minicon.eu',
    'https://me.minicon.eu'
)

$results = @()

foreach ($url in $websites) {
  $domain = $url -replace 'https://|http://', ''
  Write-Host "`nChecking: $url"
  
  try {
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -SkipHttpErrorCheck
    $status = $response.StatusCode
    $title = if ($response.Content -match '<title>([^<]+)</title>') { $matches[1] } else { 'N/A' }
    Write-Host "  Status: $status"
    Write-Host "  Title: $title"
    $results += @{
      domain = $domain
      url = $url
      status = $status
      title = $title
      healthy = ($status -eq 200)
    }
  } catch {
    Write-Host "  Error: $($_.Exception.Message)"
    $results += @{
      domain = $domain
      url = $url
      status = 'ERROR'
      title = 'N/A'
      healthy = $false
    }
  }
}

Write-Host "`n=== Summary ==="
$healthy = @($results | Where-Object { $_.healthy }).Count
Write-Host "Healthy: $healthy / $($results.Count)"
$results | ForEach-Object {
  $statusIcon = if ($_.healthy) { '✓' } else { '✗' }
  Write-Host "  $statusIcon $($_.domain) - Status: $($_.status)"
}

# Export for next steps
$results | ConvertTo-Json | Out-File -FilePath C:\working\atlas\website_status.json
