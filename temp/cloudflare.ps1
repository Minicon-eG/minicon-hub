$env:CLOUDFLARE_API_KEY = "d8b4b6f644c3de1b2573d26027278fd8f4cbb"
$env:CLOUDFLARE_EMAIL = "michael.nikolaus@minicon.eu"
$zoneId = "2d5e93525211cb229e8ed93b8d33cbf8"  # dorfkiste.org

# Add www.dorfkiste.org
$body = @{
    name = "www"
    type = "CNAME"
    content = "dorfkiste.org"
    proxied = $true
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Method POST -Headers @{
    "X-Auth-Email" = $env:CLOUDFLARE_EMAIL
    "X-Auth-Key" = $env:CLOUDFLARE_API_KEY
    "Content-Type" = "application/json"
} -Body $body

$result | ConvertTo-Json -Depth 5
