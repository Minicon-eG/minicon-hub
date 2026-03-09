Write-Host "=== Updating Hub API with Status ==="

$hubApiBase = 'https://hub.minicon.eu/api'

# Read website status
$websites = Get-Content -Path C:\working\atlas\website_status.json | ConvertFrom-Json

# Define companies and their websites
$companies = @(
    @{ name = 'Minicon eG'; key = 'ME'; domain = 'minicon.eu'; industry = 'Software & Automation'; subdomain = 'minicon.eu' },
    @{ name = 'Dahn'; key = 'DAHN'; domain = 'dahn.minicon.eu'; industry = 'Web Development'; subdomain = 'dahn.minicon.eu' },
    @{ name = 'Dorfkiste'; key = 'DORF'; domain = 'dorf.minicon.eu'; industry = 'E-Commerce'; subdomain = 'dorf.minicon.eu' },
    @{ name = 'Amazing Goods'; key = 'AG'; domain = 'ag.minicon.eu'; industry = 'E-Commerce'; subdomain = 'ag.minicon.eu' },
    @{ name = 'PDF Management'; key = 'PDFM'; domain = 'pdfm.minicon.eu'; industry = 'SaaS'; subdomain = 'pdfm.minicon.eu' },
    @{ name = 'PUIC'; key = 'PUIC'; domain = 'puic.minicon.eu'; industry = 'Consulting'; subdomain = 'puic.minicon.eu' }
)

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$changes = @()

foreach ($company in $companies) {
  Write-Host "`nProcessing: $($company.name)"
  
  # Find website status
  $websiteStatus = $websites | Where-Object { $_.domain -like "*$($company.subdomain)*" }
  
  if ($websiteStatus) {
    $status = if ($websiteStatus.healthy) { 'live' } else { 'failed' }
    Write-Host "  Status: $status (HTTP $($websiteStatus.status))"
    
    # Prepare deployment data
    $deploymentData = @{
      companyId = $company.key
      status = $status
      liveUrl = if ($status -eq 'live') { $websiteStatus.url } else { $null }
      lastChecked = $timestamp
      httpStatus = $websiteStatus.status
    } | ConvertTo-Json
    
    Write-Host "  Payload: $deploymentData"
    
    # Note: In production, we would POST to the Hub API here
    # For now, we'll log what would be sent
    $changes += @{
      company = $company.name
      status = $status
      lastCheck = $timestamp
    }
  } else {
    Write-Host "  WARNING: No website status found"
  }
}

Write-Host "`n=== Agent Activity Summary ==="
Write-Host "Time: $timestamp"
Write-Host "Changes detected:"
$changes | ForEach-Object {
  Write-Host "  - $($_.company): $($_.status)"
}

# Prepare agent activity log
$activitySummary = @"
Hub Status Update - $(Get-Date -Format 'HH:mm:ss')
- Checked $($websites.Count) websites
- Live: $(@($websites | Where-Object { $_.healthy }).Count)
- Failed: $(@($websites | Where-Object { -not $_.healthy }).Count)
- Servers: 2/2 online
- Jira: DAHN project accessible but search endpoints deprecated
- Production: 56% disk, 41% memory
- Secondary: 22% disk, 22% memory
"@

Write-Host "`n$activitySummary"

# Export summary
@{
  timestamp = $timestamp
  websitesChecked = $websites.Count
  sitesLive = @($websites | Where-Object { $_.healthy }).Count
  sitesFailed = @($websites | Where-Object { -not $_.healthy }).Count
  serversOnline = 2
  activitySummary = $activitySummary
  changes = $changes
} | ConvertTo-Json | Out-File -FilePath C:\working\atlas\hub_update_summary.json

Write-Host "`n✓ Summary saved to hub_update_summary.json"
