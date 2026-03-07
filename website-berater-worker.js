--6b5c811547d7589fa5c806b64bb29d0811f3de507d68c0b861d6acaf3a21
Content-Disposition: form-data; name="worker.js"

const SYSTEM_PROMPT = `Du bist der Website-Berater der Minicon eG aus Dahn (Pfalz). Deine Aufgabe: Alle Informationen sammeln, die wir brauchen, um eine professionelle Website für den Kunden zu bauen.

ÜBER MINICON:
- Minicon eG ist eine IT-Genossenschaft aus Dahn
- Sonderangebot: €200 einmalig = Website + 12 Monate Hosting + SSL
- Nach dem 1. Jahr: nur €5/Monat Hosting
- Einfache Änderungen kostenlos, größere nach Angebot
- Kontakt: info@minicon.eu

UNSERE REFERENZEN (nur diese zeigen, und NUR wenn sie zur Branche passen!):
- Verein/Sport: tv-dahn.minicon.eu (Turnverein Dahn 1886 — NUR bei Vereinen zeigen!)
- IT/Dienstleistung: gem.minicon.eu (GEM Team Solutions — IT-Beratung), ivalticare.minicon.eu (IvaltiCare GmbH — IT/Daten)
WICHTIG: Zeige NUR Referenzen die zur Branche des Kunden passen. Wenn keine passt, sag ehrlich dass wir Referenzen aus anderen Branchen haben und zeige die als Beispiel für Design-Qualität. NIEMALS einen Turnverein als Handwerks-Referenz zeigen!

GESPRÄCHSABLAUF — Frage diese Infos nacheinander ab (nicht alle auf einmal!):
1. Firmenname und Branche
2. Standort / Adresse
3. Was bieten sie an? (Produkte, Dienstleistungen, Speisekarte, Abteilungen etc.)
4. Öffnungszeiten (falls relevant)
5. Haben sie bereits eine Website? Wenn ja: URL (damit wir Inhalte/Bilder übernehmen können)
6. Haben sie ein Logo? Welche Farben soll die Website haben?
7. Welche Seiten/Funktionen wünschen sie? (Speisekarte, Galerie, Kontaktformular, Terminbuchung, Team-Seite etc.)
8. Besondere Wünsche oder Inhalte die unbedingt drauf müssen?
9. Kontaktdaten für die Website: Telefon, E-Mail, Social Media

Wenn alle relevanten Infos gesammelt sind, fasse zusammen und frage nach Name + E-Mail für die Anfrage.

DEIN VERHALTEN:
- Sprich Deutsch, freundlich und professionell (Sie-Form)
- Frage immer nur 1-2 Dinge gleichzeitig, nicht alles auf einmal
- Zeige passende Referenz-Websites als Beispiele wenn es passt
- Empfehle proaktiv Features die zur Branche passen
- Halte Antworten kurz (max 3-4 Sätze)
- Verlinke Referenzen als URLs: https://SITE.minicon.eu
- NIEMALS technische Details erwähnen
- Beantworte NUR Fragen zu Websites und Minicon

ANFRAGE-ABSCHLUSS:
Wenn du genug Infos hast, fasse alles zusammen und frage:
"Soll ich diese Anfrage an unser Team weiterleiten? Dafür bräuchte ich nur noch Ihren Namen und Ihre E-Mail-Adresse."
Wenn der Nutzer Name + E-Mail gibt, antworte mit diesem Format:
[ANFRAGE_SENDEN]
Name: {name}
Email: {email}
Firma: {firma}
Branche: {branche}
Standort: {adresse}
Angebot: {was sie anbieten}
Oeffnungszeiten: {öffnungszeiten oder "nicht angegeben"}
BestehendeWebsite: {url oder "keine"}
Logo: {ja/nein + farbwünsche}
Seiten: {gewünschte seiten/funktionen}
Besonderes: {besondere wünsche}
Kontakt: {telefon, email, social media}
[/ANFRAGE_SENDEN]
Danach sage: "Vielen Dank! Ich habe alle Informationen an unser Team weitergeleitet. Wir melden uns innerhalb von 24 Stunden bei Ihnen. 🎉"`;

const MAX_REQUESTS_PER_HOUR = 50;
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES_PER_CONVERSATION = 15;

const RESEND_API_KEY = 're_bxqzKnVZ_mEpZzcNyv9FKf1hPJvJevz2v';
const NOTIFY_EMAIL = 'info@minicon.eu';

async function sendLeadEmail(leadData, conversationSummary) {
  const row = (label, val) => val && val !== 'nicht angegeben' ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">${label}</td><td style="padding:8px;border:1px solid #ddd">${val}</td></tr>` : '';
  const html = `
<h2>🎯 Neue Website-Anfrage über KI-Berater</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${leadData.name}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">E-Mail</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${leadData.email}">${leadData.email}</a></td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Firma</td><td style="padding:8px;border:1px solid #ddd">${leadData.firma}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Branche</td><td style="padding:8px;border:1px solid #ddd">${leadData.branche}</td></tr>
  ${row('Standort', leadData.standort)}
  ${row('Angebot/Leistungen', leadData.angebot)}
  ${row('Öffnungszeiten', leadData.oeffnungszeiten)}
  ${row('Bestehende Website', leadData.bestehendewebsite)}
  ${row('Logo/Farben', leadData.logo)}
  ${row('Gewünschte Seiten', leadData.seiten)}
  ${row('Besondere Wünsche', leadData.besonderes)}
  ${row('Kontaktdaten', leadData.kontakt)}
</table>
<h3>Gesprächsverlauf</h3>
<pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;white-space:pre-wrap">${conversationSummary}</pre>
<p style="color:#666;font-size:12px">Gesendet vom Minicon KI-Berater · ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'KI-Berater <noreply@support.minicon.eu>',
      to: [NOTIFY_EMAIL],
      subject: `🎯 Website-Anfrage: ${leadData.firma} (${leadData.branche})`,
      html,
    }),
  });
}

function parseLeadData(text) {
  const match = text.match(/\[ANFRAGE_SENDEN\]([\s\S]*?)\[\/ANFRAGE_SENDEN\]/);
  if (!match) return null;
  const block = match[1];
  const get = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`, 'i'));
    return m ? m[1].trim() : '';
  };
  return { name: get('Name'), email: get('Email'), firma: get('Firma'), branche: get('Branche'), standort: get('Standort'), angebot: get('Angebot'), oeffnungszeiten: get('Oeffnungszeiten'), bestehendewebsite: get('BestehendeWebsite'), logo: get('Logo'), seiten: get('Seiten'), besonderes: get('Besonderes'), kontakt: get('Kontakt') };
}

function formatConversation(messages) {
  return messages.map(m => `${m.role === 'user' ? '👤 Kunde' : '🤖 Berater'}: ${m.content}`).join('\n\n');
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Direct email endpoint for the form
    if (url.pathname === '/email') {
      try {
        const body = await request.json();
        const { name, email, firma, branche, features, website, nachricht } = body;
        if (!name || !email || !firma) {
          return new Response(JSON.stringify({ error: 'Name, E-Mail und Firma sind Pflichtfelder.' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        const html = `
<h2>📧 Neue Website-Anfrage (Formular)</h2>
<table style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">E-Mail</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${email}">${email}</a></td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Firma</td><td style="padding:8px;border:1px solid #ddd">${firma}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Branche</td><td style="padding:8px;border:1px solid #ddd">${branche || '-'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Gewünschte Features</td><td style="padding:8px;border:1px solid #ddd">${features || '-'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Bestehende Website</td><td style="padding:8px;border:1px solid #ddd">${website || '-'}</td></tr>
</table>
${nachricht ? `<h3>Nachricht</h3><p style="background:#f5f5f5;padding:16px;border-radius:8px">${nachricht}</p>` : ''}
<p style="color:#666;font-size:12px">Gesendet über das Kontaktformular · ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</p>`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Website-Anfrage <noreply@support.minicon.eu>',
            to: [NOTIFY_EMAIL],
            subject: `📧 Website-Anfrage: ${firma}`,
            html,
          }),
        });
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Fehler beim Senden.' }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Rate limiting by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `rl:${ip}`;

    if (env.RATE_LIMIT) {
      const count = parseInt(await env.RATE_LIMIT.get(rateLimitKey) || '0');
      if (count >= MAX_REQUESTS_PER_HOUR) {
        return new Response(JSON.stringify({
          error: 'rate_limit',
          response: 'Sie haben das Nachrichtenlimit erreicht. Bitte kontaktieren Sie uns direkt unter info@minicon.eu oder versuchen Sie es in einer Stunde erneut.'
        }), { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }
      await env.RATE_LIMIT.put(rateLimitKey, String(count + 1), { expirationTtl: 3600 });
    }

    try {
      const body = await request.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: 'messages required' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (messages.length > MAX_MESSAGES_PER_CONVERSATION) {
        return new Response(JSON.stringify({
          response: 'Vielen Dank für das Gespräch! Für eine ausführlichere Beratung kontaktieren Sie uns gerne direkt unter info@minicon.eu. Wir freuen uns auf Sie! 🎉'
        }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      const sanitizedMessages = messages.slice(-12).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: typeof m.content === 'string' ? m.content.slice(0, MAX_MESSAGE_LENGTH) : '',
      }));

      const aiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...sanitizedMessages,
      ];

      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: aiMessages,
        max_tokens: 500,
      });

      let responseText = response.response;

      // Check if AI wants to send a lead
      const leadData = parseLeadData(responseText);
      if (leadData && leadData.email) {
        await sendLeadEmail(leadData, formatConversation(sanitizedMessages));
        // Remove the tag from the response
        responseText = responseText.replace(/\[ANFRAGE_SENDEN\][\s\S]*?\[\/ANFRAGE_SENDEN\]\s*/g, '').trim();
        if (!responseText) {
          responseText = `Vielen Dank, ${leadData.name}! Ich habe Ihre Anfrage an unser Team weitergeleitet. Michael meldet sich innerhalb von 24 Stunden bei Ihnen unter ${leadData.email}. 🎉`;
        }
      }

      return new Response(JSON.stringify({ response: responseText, leadSent: !!leadData }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({
        error: 'ai_error',
        response: 'Entschuldigung, es gab einen technischen Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter info@minicon.eu.'
      }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
  },
};

--6b5c811547d7589fa5c806b64bb29d0811f3de507d68c0b861d6acaf3a21--

