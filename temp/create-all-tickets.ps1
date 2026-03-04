$b = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("michael.nikolaus@minicon.eu:ATATT3xFfGF0PXnxEUMiAh3bKzlDfNEAUL3kQGSFOvfXqyPko6BTzl2pzN43uu2z_g-EAFcnMvvqdgSNkk_JB-_G7aF4hjzL5PfC0X2USsSINlr0dIU2gnCRaBnPrJ059PItx7IOnUkbBySQ04kpW0PvOTVYLgT9DT-0coL_aNq6RFVEijairjg=F870BBB4"))
$headers = @{ "Authorization" = "Basic $b"; "Content-Type" = "application/json" }
$uri = "https://minicon.atlassian.net/rest/api/3/issue"

$websites = @(
    @{ name="Paelzer Schdubb"; addr="Dahn"; kat="Restaurant"; bew="529"; hat_web="Nein"; status="LIVE"; subdomain="schdubb.minicon.eu"; notiz="Erste Website, bereits deployed und live." },
    @{ name="Pastaria"; addr="Weissenburger Str. 3, 66994 Dahn"; kat="Restaurant"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="pastaria.minicon.eu"; notiz="Direkt in Dahn, keine eigene Website gefunden." },
    @{ name="Pizzeria Deluxe"; addr="Weissenburger Str. 17B, 66994 Dahn"; kat="Pizzeria"; bew="3.6 (5)"; hat_web="Ja"; status="Recherche"; subdomain="pizzeria-deluxe.minicon.eu"; notiz="Hat Website, aber Qualitaet pruefen." },
    @{ name="Ratsstube"; addr="Weissenburger Str. 1, 66994 Dahn"; kat="Pfaelzische Kueche"; bew="3.2 (4)"; hat_web="Ja"; status="Recherche"; subdomain="ratsstube.minicon.eu"; notiz="Pfaelzisches Restaurant, hat Website." },
    @{ name="Pizzeria Ischia"; addr="Weissenburger Str. 15, 66994 Dahn"; kat="Pizzeria"; bew="3.0 (3)"; hat_web="Ja"; status="Recherche"; subdomain="ischia.minicon.eu"; notiz="Italienisch, hat Website." },
    @{ name="Baran Shisha Lounge"; addr="Kanalstr. 7, 66994 Dahn"; kat="Shisha-Bar"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="baran.minicon.eu"; notiz="Shisha Bar, keine Website." },
    @{ name="Asia Wok"; addr="Weissenburger Str. 6, 66994 Dahn"; kat="Asiatisch"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="asia-wok.minicon.eu"; notiz="Asiatisches Restaurant, keine Website." },
    @{ name="Chinarestaurant Dahn"; addr="Pirmasenser Str. 52, 66994 Dahn"; kat="Chinesisch"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="china-dahn.minicon.eu"; notiz="Chinesisch, keine Website." },
    @{ name="Restaurante di Vino"; addr="Pirmasenser Str. 47, 66994 Dahn"; kat="Italienisch"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="di-vino.minicon.eu"; notiz="Italienisch, keine Website." },
    @{ name="Loreth Annemarie Gasthaus"; addr="Hasenbergstr. 10, 66994 Dahn"; kat="Gasthaus"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="loreth.minicon.eu"; notiz="Gasthaus direkt in Dahn." },
    @{ name="Baerenbrunnerhof"; addr="Hauptstr. 44, 66996 Schindhard"; kat="Restaurant"; bew="3.0 (2)"; hat_web="Ja"; status="Recherche"; subdomain="baerenbrunnerhof.minicon.eu"; notiz="3.4km von Dahn, hat Website." },
    @{ name="Pizzeria Sardenga"; addr="Eichelbergstr. 12, 76891 Busenberg"; kat="Pizzeria"; bew="5.0 (4)"; hat_web="Nein"; status="Recherche"; subdomain="sardenga.minicon.eu"; notiz="Top bewertet! 4.2km, keine Website." },
    @{ name="Gaststatte Dionysos"; addr="Hauptstr. 80, 66999 Hinterweidenthal"; kat="Griechisch"; bew="5.0 (1)"; hat_web="Ja"; status="Recherche"; subdomain="dionysos.minicon.eu"; notiz="Griechisch, hat Website, 5.1km." },
    @{ name="Zum Jaegerhof"; addr="Winterbergstr. 34, 66996 Erfweiler"; kat="Pfaelzisch"; bew="-"; hat_web="Ja"; status="Recherche"; subdomain="jaegerhof.minicon.eu"; notiz="Pfaelzisch, hat Website, 2.4km." },
    @{ name="Krone Bundenthal"; addr="Hauptstr. 98-100, 76891 Bundenthal"; kat="Restaurant"; bew="4.8 (5)"; hat_web="Ja"; status="Recherche"; subdomain="krone.minicon.eu"; notiz="Sehr gut bewertet, 6.6km, hat Website." },
    @{ name="Pension Pfaelzerwald"; addr="Hauptstr. 50, 66999 Hinterweidenthal"; kat="Restaurant/Pension"; bew="-"; hat_web="Nein"; status="Recherche"; subdomain="pfaelzerwald.minicon.eu"; notiz="Restaurant + Pension, 5.4km." },
    @{ name="Landgasthof Am Teufelstisch"; addr="Im Handschuhteich 29, 66999 Hinterweidenthal"; kat="Pfaelzisch"; bew="-"; hat_web="Ja"; status="Recherche"; subdomain="teufelstisch.minicon.eu"; notiz="Bekanntes Ausflugsziel, hat Website." },
    @{ name="Buehlhofschaenke"; addr="Buehlhof 1, 76889 Oberschlettenbach"; kat="Pfaelzisch"; bew="3.0 (1)"; hat_web="Ja"; status="Recherche"; subdomain="buehlhof.minicon.eu"; notiz="5.9km, hat Website." },
    @{ name="Zwickerstubb"; addr="Hauptstr. 4, 76846 Hauenstein"; kat="Deutsch"; bew="5.0 (2)"; hat_web="Nein"; status="Recherche"; subdomain="zwickerstubb.minicon.eu"; notiz="Top bewertet, 7.2km, keine Website." }
)

$created = @()
foreach ($w in $websites) {
    $desc = @{
        type = "doc"
        version = 1
        content = @(
            @{ type = "heading"; attrs = @{ level = 3 }; content = @(@{ type = "text"; text = "Analyse" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Kategorie: $($w.kat)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Adresse: $($w.addr)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Bewertungen: $($w.bew)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Hat Website: $($w.hat_web)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Notiz: $($w.notiz)" }) },
            @{ type = "heading"; attrs = @{ level = 3 }; content = @(@{ type = "text"; text = "Entwicklung" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Subdomain: $($w.subdomain)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Template: Next.js Standard" }) },
            @{ type = "heading"; attrs = @{ level = 3 }; content = @(@{ type = "text"; text = "Deployment" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Server: minicon-web (91.98.30.140)" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Status: $($w.status)" }) },
            @{ type = "heading"; attrs = @{ level = 3 }; content = @(@{ type = "text"; text = "Akquise" }) },
            @{ type = "paragraph"; content = @(@{ type = "text"; text = "Status: Nicht gestartet" }) }
        )
    }

    $body = @{
        fields = @{
            project = @{ key = "DAHN" }
            summary = "[Website] $($w.name)"
            description = $desc
            issuetype = @{ name = "Task" }
        }
    } | ConvertTo-Json -Depth 15

    try {
        $result = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
        Write-Host "OK: $($result.key) - $($w.name)"
        $created += "$($result.key): $($w.name)"
    } catch {
        Write-Host "FEHLER: $($w.name) - $($_.Exception.Message)"
    }
}

Write-Host "`n=== ZUSAMMENFASSUNG ==="
Write-Host "$($created.Count) Tickets erstellt"
$created | ForEach-Object { Write-Host $_ }
