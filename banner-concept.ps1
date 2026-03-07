$email = "michael.nikolaus@minicon.eu"
$atlToken = "ATATT3xFfGF0yEHkM5oMyjhK3RuVoHvspciQEUYc_iQ6HINlQiycThZ80kSjSEvqvYB_X-obC08AE9cI6qD83VVeDHEZ10PuL1J3Rsk8QHGIefdVGk81OqEFFGXycdoGivuVqTgtEEGcwBhPsl8ejbwI9W5U28873h9yLLso7HR0UfBJaMTIWto=9218DD40"
$bytes = [System.Text.Encoding]::ASCII.GetBytes("${email}:${atlToken}")
$auth = [Convert]::ToBase64String($bytes)

$body = @'
<ac:structured-macro ac:name="info" ac:schema-version="1">
<ac:rich-text-body>
<p><strong>Status: Konzept — zur Freigabe durch Michael</strong><br/>
Erstellt: 06.03.2026 | Autor: Atlas</p>
</ac:rich-text-body>
</ac:structured-macro>

<h2>1. Uebersicht</h2>
<p>Zwei unabhaengige, wiederverwendbare Komponenten:</p>
<table><tbody>
<tr><th>Komponente</th><th>Wann</th><th>Position</th><th>Steuerung</th></tr>
<tr><td><strong>DemoBanner</strong></td><td>Site noch nicht bezahlt</td><td>Oben (fixed)</td><td>DB-Status: <code>paid = false</code></td></tr>
<tr><td><strong>PreviewBanner</strong></td><td>Immer auf preview-* Domains</td><td>Unten (fixed)</td><td>Automatisch per Domain-Erkennung</td></tr>
</tbody></table>
<ac:structured-macro ac:name="note" ac:schema-version="1">
<ac:rich-text-body>
<p><strong>Ausnahmen Demo-Banner:</strong> TV Dahn und GEM erhalten keinen Demo-Banner (bereits bezahlt / Sonderkonditionen). Status in DB mit <code>exemptFromBanner = true</code> setzen.</p>
</ac:rich-text-body>
</ac:structured-macro>

<h2>2. Komponente: DemoBanner</h2>
<h3>Verhalten</h3>
<ul>
<li>Erscheint oben (fixed, z-index 9999) auf allen DAHN-Sites mit <code>paid = false</code></li>
<li>Verschwindet automatisch wenn Zahlung erfolgt (DB-Status auf <code>paid = true</code>)</li>
<li>Link zeigt auf <code>https://minicon.eu/angebot/{siteName}</code></li>
<li>Nicht auf preview-* Domains (dort nur PreviewBanner)</li>
</ul>

<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">tsx</ac:parameter><ac:plain-text-body><![CDATA[
// components/DemoBanner.tsx
'use client';
import { useEffect, useState } from 'react';

export function DemoBanner({ siteName }: { siteName: string }) {
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    // Nur auf Produktions-Domains anzeigen
    if (window.location.hostname.startsWith('preview-')) {
      setPaid(true); // Banner auf Preview ausblenden
      return;
    }
    fetch(`https://api.minicon.eu/api/sites/${siteName}/status`)
      .then(r => r.json())
      .then(d => setPaid(d.paid))
      .catch(() => setPaid(false));
  }, [siteName]);

  if (paid === null || paid === true) return null;

  return (
    <>
      <div style={{ height: 48 }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
        color: 'white', height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        fontSize: 14, fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <span>Demo-Vorschau - nur <strong>200 EUR</strong> inkl. 12 Monate Hosting</span>
        <a
          href={`https://minicon.eu/angebot/${siteName}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            background: 'white', color: '#4f46e5',
            padding: '5px 14px', borderRadius: 999,
            fontWeight: 700, textDecoration: 'none'
          }}
        >
          Jetzt sichern
        </a>
      </div>
    </>
  );
}
]]></ac:plain-text-body></ac:structured-macro>

<h2>3. Komponente: PreviewBanner</h2>
<h3>Verhalten</h3>
<ul>
<li>Erscheint immer unten (fixed) wenn Domain mit <code>preview-</code> beginnt</li>
<li>Kein API-Call noetig — reine Domain-Erkennung im Browser</li>
<li>Zeigt Link zur Produktions-URL</li>
</ul>

<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">tsx</ac:parameter><ac:plain-text-body><![CDATA[
// components/PreviewBanner.tsx
'use client';
import { useEffect, useState } from 'react';

export function PreviewBanner({ siteName }: { siteName: string }) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.location.hostname.startsWith('preview-'));
  }, []);

  if (!isPreview) return null;

  return (
    <>
      <div style={{ height: 44 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: '#1e293b', color: '#94a3b8',
        height: 44, display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 12, fontSize: 13,
        borderTop: '1px solid #334155'
      }}>
        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Vorschau</span>
        <span>Diese Seite ist noch nicht live.</span>
        <a
          href={`https://${siteName}.minicon.eu`}
          style={{ color: '#60a5fa', textDecoration: 'underline', fontSize: 12 }}
        >
          Produktions-URL: {siteName}.minicon.eu
        </a>
      </div>
    </>
  );
}
]]></ac:plain-text-body></ac:structured-macro>

<h3>Einbindung in layout.tsx</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">tsx</ac:parameter><ac:plain-text-body><![CDATA[
import { DemoBanner } from '@/components/DemoBanner';
import { PreviewBanner } from '@/components/PreviewBanner';

const SITE_NAME = 'ratsstube'; // je Website anpassen

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <DemoBanner siteName={SITE_NAME} />
        {children}
        <PreviewBanner siteName={SITE_NAME} />
      </body>
    </html>
  );
}
]]></ac:plain-text-body></ac:structured-macro>

<h2>4. Datenbank-Schema (MongoDB / website-service)</h2>
<h3>Neue Collection: sites</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">typescript</ac:parameter><ac:plain-text-body><![CDATA[
// models/site.model.ts
const SiteSchema = new Schema({
  name:              { type: String, required: true, unique: true }, // "ratsstube"
  displayName:       { type: String },                               // "Ratsstube Dahn"
  domain:            { type: String },                               // "ratsstube.minicon.eu"
  paid:              { type: Boolean, default: false },
  paidAt:            { type: Date },
  stripeSessionId:   { type: String },
  stripeCustomerId:  { type: String },
  exemptFromBanner:  { type: Boolean, default: false }, // TV Dahn, GEM
}, { timestamps: true });
]]></ac:plain-text-body></ac:structured-macro>

<h3>Initiale Datensaetze</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">json</ac:parameter><ac:plain-text-body><![CDATA[
[
  { "name": "tv-dahn",    "paid": true,  "exemptFromBanner": true },
  { "name": "gem",        "paid": true,  "exemptFromBanner": true },
  { "name": "ratsstube",  "paid": false, "exemptFromBanner": false },
  { "name": "waldhuette", "paid": false, "exemptFromBanner": false },
  { "name": "china-dahn", "paid": false, "exemptFromBanner": false },
  { "name": "kve-dahn",   "paid": false, "exemptFromBanner": false },
  { "name": "musikverein-dahn", "paid": false, "exemptFromBanner": false }
]
]]></ac:plain-text-body></ac:structured-macro>

<h2>5. API-Endpunkte (website-service)</h2>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">typescript</ac:parameter><ac:plain-text-body><![CDATA[
// GET /api/sites/:name/status — oeffentlich, kein Auth
router.get('/sites/:name/status', async (req, res) => {
  const site = await Site.findOne({ name: req.params.name });
  if (!site) return res.json({ paid: false });
  res.json({
    paid: site.paid || site.exemptFromBanner,
    paidAt: site.paidAt,
  });
});

// POST /api/sites/:name/pay — intern via Stripe Webhook
router.post('/sites/:name/pay', adminAuth, async (req, res) => {
  const { stripeSessionId, stripeCustomerId } = req.body;
  await Site.findOneAndUpdate(
    { name: req.params.name },
    { paid: true, paidAt: new Date(), stripeSessionId, stripeCustomerId },
    { upsert: true }
  );
  res.json({ ok: true });
});
]]></ac:plain-text-body></ac:structured-macro>

<h2>6. Stripe Webhook erweitern</h2>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">typescript</ac:parameter><ac:plain-text-body><![CDATA[
case 'checkout.session.completed': {
  const session = event.data.object;
  const siteName = session.client_reference_id; // z.B. "ratsstube"
  if (siteName) {
    await Site.findOneAndUpdate(
      { name: siteName },
      { paid: true, paidAt: new Date(),
        stripeSessionId: session.id,
        stripeCustomerId: session.customer },
      { upsert: true }
    );
  }
  break;
}
]]></ac:plain-text-body></ac:structured-macro>

<h2>7. CORS anpassen</h2>
<p>Aktuell: nur <code>mein.minicon.eu</code>, <code>minicon.eu</code>, <code>www.minicon.eu</code></p>
<p>Benoetigt: alle <code>*.minicon.eu</code> Subdomains (dynamische Pruefung empfohlen):</p>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">typescript</ac:parameter><ac:plain-text-body><![CDATA[
origin: (origin, callback) => {
  if (!origin || origin.endsWith('.minicon.eu') || origin === 'https://minicon.eu') {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}
]]></ac:plain-text-body></ac:structured-macro>

<h2>8. Offene Fragen</h2>
<table><tbody>
<tr><th>#</th><th>Frage</th><th>Entscheidung</th></tr>
<tr><td>1</td><td>Welche weiteren Sites sind wie TV Dahn / GEM ausgenommen?</td><td>Offen</td></tr>
<tr><td>2</td><td>DemoBanner: Einmaliger Check beim Laden oder periodisch pollen (z.B. alle 60s)?</td><td>Offen</td></tr>
<tr><td>3</td><td>Preview-Banner: Auch DemoBanner auf preview-Domains zeigen oder nur PreviewBanner?</td><td>Konzept: nur PreviewBanner (kein Verkaufsdruck auf Preview)</td></tr>
<tr><td>4</td><td>Bestehende Sites nachrueesten oder nur neue Sites?</td><td>Offen</td></tr>
<tr><td>5</td><td>Verteilung der Komponenten: copy-paste in jeden Repo oder shared NPM-Paket?</td><td>Offen</td></tr>
</tbody></table>

<h2>9. Implementierungs-Reihenfolge</h2>
<ol>
<li>website-service: <code>sites</code> Collection + Schema</li>
<li>website-service: API <code>GET /api/sites/:name/status</code></li>
<li>website-service: Stripe-Webhook erweitern</li>
<li>website-service: CORS oeffnen</li>
<li>DB: Seed-Daten anlegen (alle DAHN-Sites)</li>
<li>Komponenten: <code>DemoBanner.tsx</code> + <code>PreviewBanner.tsx</code> erstellen</li>
<li>Alle DAHN-Websites: Komponenten einbauen + deployen</li>
</ol>
'@

$pageData = @{
    type = "page"
    title = "Konzept: Demo-Banner und Preview-Banner (Stripe-Integration)"
    ancestors = @(@{ id = "840433666" })
    space = @{ key = "MINICON" }
    body = @{ storage = @{ value = $body; representation = "storage" } }
} | ConvertTo-Json -Depth 10

$r = Invoke-RestMethod -Uri "https://minicon.atlassian.net/wiki/rest/api/content" -Method POST `
    -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/json"; Accept = "application/json" } `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($pageData))

Write-Host "OK: $($r.id)"
Write-Host "$($r._links.base)$($r._links.webui)"
