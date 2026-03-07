--1fd8a448e112319d8a368d2aec6c6f9d3ea5c709631d09e4e48990228ed7
Content-Disposition: form-data; name="worker.js"

/**
 * TTC Dahn API Worker
 * Scraped click-TT Daten für TTC Dahn (club=11724)
 * Cache: 1 Stunde
 */

const CLICK_TT_BASE = "https://pttv.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/clubMeetings?club=11724";
const CACHE_TTL = 3600; // 1 Stunde
const TTC_DAHN_PATTERN = /TTC Dahn/i;

function parseMatches(html) {
  const matches = [];
  // Extrahiere alle <tr> Zeilen aus dem Haupttable
  const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];

  for (const row of rows) {
    // Extrahiere alle <td> Zellen
    const cells = [];
    const cellMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    for (const cell of cellMatches) {
      // Strip HTML tags, decode entities, trim
      const text = cell
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/&uuml;/g, "ü")
        .replace(/&ouml;/g, "ö")
        .replace(/&auml;/g, "ä")
        .replace(/&szlig;/g, "ß")
        .replace(/&Uuml;/g, "Ü")
        .replace(/&Ouml;/g, "Ö")
        .replace(/&Auml;/g, "Ä")
        .replace(/\s+/g, " ")
        .trim();
      cells.push(text);
    }

    // Brauchen mindestens 7 Zellen: Tag, Datum, Zeit, Ort, (leer), Liga, Heim, Gast, [Ergebnis]
    if (cells.length < 7) continue;

    // Suche Datum im Format DD.MM.YYYY
    let date = "";
    let time = "";
    let league = "";
    let home = "";
    let away = "";
    let score = null;

    // Finde Datum-Zelle
    const dateIdx = cells.findIndex(c => /^\d{2}\.\d{2}\.\d{4}$/.test(c));
    if (dateIdx === -1) continue;

    date = cells[dateIdx];
    time = cells[dateIdx + 1] || "";

    // Liga ist meist 2-4 Zeichen (EKL, VOL H, JU19BL etc.)
    // Heim und Gast danach
    // Suche nach Liga-Pattern
    for (let i = dateIdx + 2; i < cells.length - 1; i++) {
      const cell = cells[i];
      // Liga: kurze Strings wie "EKL", "VOL H", "JU19BL", "EKKB", "1. PL D"
      if (cell.length > 0 && cell.length <= 12 && !cell.match(/^\d+:\d+$/) && !cell.match(/^\(\d\)$/)) {
        // Prüfe ob nächste Zellen Team-Namen sind
        if (i + 2 < cells.length) {
          league = cell;
          home = cells[i + 1] || "";
          away = cells[i + 2] || "";

          // Ergebnis? Format: "3:9" oder "9:3"
          if (i + 3 < cells.length) {
            const possibleScore = cells[i + 3];
            if (/^\d+:\d+$/.test(possibleScore)) {
              score = possibleScore;
            }
          }

          // Validierung: mindestens ein Team muss TTC Dahn enthalten
          if (TTC_DAHN_PATTERN.test(home) || TTC_DAHN_PATTERN.test(away)) {
            break;
          }

          // Reset wenn kein TTC Dahn gefunden
          league = "";
          home = "";
          away = "";
          score = null;
        }
      }
    }

    if (!home || !away) continue;
    if (!TTC_DAHN_PATTERN.test(home) && !TTC_DAHN_PATTERN.test(away)) continue;

    // Bestimme ob Heimspiel und Ergebnis
    const isHome = TTC_DAHN_PATTERN.test(home);
    let ttcScore = null;
    let oppScore = null;
    let won = null;

    if (score) {
      const parts = score.split(":");
      if (parts.length === 2) {
        const homeScore = parseInt(parts[0]);
        const awayScore = parseInt(parts[1]);
        ttcScore = isHome ? homeScore : awayScore;
        oppScore = isHome ? awayScore : homeScore;
        won = ttcScore > oppScore;
      }
    }

    // Datum in ISO umwandeln für Sortierung
    const [d, m, y] = date.split(".");
    const isoDate = `${y}-${m}-${d}`;

    matches.push({
      date,
      isoDate,
      time: time.replace(/\(.*?\)/g, "").trim(),
      league,
      home: home.replace(/\s+$/, ""),
      away: away.replace(/\s+$/, ""),
      score: score || null,
      ttcScore,
      oppScore,
      won,
      isHome,
      isResult: score !== null,
    });
  }

  return matches;
}

async function fetchPage(week) {
  const url = week === 0
    ? CLICK_TT_BASE
    : `${CLICK_TT_BASE}&week=${week}`;

  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TTC-Dahn-Bot/1.0)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "de-DE,de;q=0.9",
    },
    cf: { cacheTtl: CACHE_TTL },
  });

  if (!resp.ok) throw new Error(`click-TT fetch failed: ${resp.status}`);
  return resp.text();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Cache check
    const cache = caches.default;
    const cacheKey = new Request(url.toString());
    let cached = await cache.match(cacheKey);
    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set("X-Cache", "HIT");
      return new Response(cached.body, { ...cached, headers });
    }

    try {
      // 3 Wochen: aktuelle Woche (upcoming) + letzte 2 Wochen (results)
      const [html0, htmlMinus1, htmlMinus2] = await Promise.all([
        fetchPage(0),
        fetchPage(-1),
        fetchPage(-2),
      ]);

      const allMatches = [
        ...parseMatches(htmlMinus2),
        ...parseMatches(htmlMinus1),
        ...parseMatches(html0),
      ];

      // Deduplizierung nach date+home+away
      const seen = new Set();
      const unique = allMatches.filter(m => {
        const key = `${m.isoDate}-${m.home}-${m.away}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sortieren: neueste zuerst
      unique.sort((a, b) => b.isoDate.localeCompare(a.isoDate));

      const results = unique.filter(m => m.isResult);
      const upcoming = unique.filter(m => !m.isResult).reverse(); // aufsteigend

      const data = {
        club: "TTC Dahn",
        clubId: 11724,
        lastUpdated: new Date().toISOString(),
        results,
        upcoming,
      };

      const body = JSON.stringify(data);
      const response = new Response(body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": `public, max-age=${CACHE_TTL}`,
          "X-Cache": "MISS",
        },
      });

      // In Cloudflare Cache speichern
      await cache.put(cacheKey, response.clone());
      return response;

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

--1fd8a448e112319d8a368d2aec6c6f9d3ea5c709631d09e4e48990228ed7--

