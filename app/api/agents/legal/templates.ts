export const IMPRESSUM_TEMPLATE = (company: any) => `
# Impressum

## Angaben gemäß § 5 TMG
${company.name}
${company.address || '[Adresse]'}

## Vertreten durch
${company.managingDirector || '[Geschäftsführer]'}

## Kontakt
E-Mail: ${company.contactEmail || '[Email]'}

## Registereintrag
Eintragung im Handelsregister.
Registergericht: [Gericht]
Registernummer: ${company.registerEntry || '[HRB XXX]'}

## Umsatzsteuer-ID
Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
${company.vatId || '[DE XXX]'}
`;

export const PRIVACY_TEMPLATE = (company: any) => `
# Datenschutzerklärung

## 1. Datenschutz auf einen Blick
### Allgemeine Hinweise
Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen...

### Verantwortliche Stelle
${company.name}
${company.address || '[Adresse]'}
E-Mail: ${company.contactEmail || '[Email]'}
`;

export const COOKIE_POLICY_TEMPLATE = `
# Cookie-Richtlinie

Diese Website verwendet Cookies. Wir nutzen Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren...
`;
