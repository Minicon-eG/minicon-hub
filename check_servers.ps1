Write-Host "=== Server Health Check ==="

$servers = @(
    @{ ip = '91.98.30.140'; name = 'Production' },
    @{ ip = '46.225.171.254'; name = 'Secondary' }
)

$results = @()

foreach ($server in $servers) {
  Write-Host "`nChecking: $($server.name) ($($server.ip))"
  
  try {
    # Check uptime
    $uptime = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "root@$($server.ip)" "uptime" 2>&1
    Write-Host "  Uptime: $uptime"
    
    # Check disk usage
    $disk = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "root@$($server.ip)" "df -h / | tail -1" 2>&1
    Write-Host "  Disk: $disk"
    
    # Check memory
    $memory = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "root@$($server.ip)" "free -h | grep Mem" 2>&1
    Write-Host "  Memory: $memory"
    
    # Check Docker containers
    $docker = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "root@$($server.ip)" "docker ps --format '{{.Names}}: {{.Status}}' 2>/dev/null | head -5" 2>&1
    Write-Host "  Docker Containers:"
    $docker | ForEach-Object { Write-Host "    $_" }
    
    $results += @{
      server = $server.name
      ip = $server.ip
      online = $true
      uptime = $uptime
    }
  } catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
    $results += @{
      server = $server.name
      ip = $server.ip
      online = $false
      error = $_.Exception.Message
    }
  }
}

Write-Host "`n=== Summary ==="
$online = @($results | Where-Object { $_.online }).Count
Write-Host "Servers Online: $online / $($results.Count)"

# Export for next steps
$results | ConvertTo-Json | Out-File -FilePath C:\working\atlas\server_status.json
