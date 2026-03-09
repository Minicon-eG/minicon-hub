import re

# Read the file
with open('/opt/build/minicon-website-service/src/routes/cr.routes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update function signature to include new parameters
old_sig = '''function buildApprovalEmailHtml(opts: {
  description: string;
  previewUrl: string;'''

new_sig = '''function buildApprovalEmailHtml(opts: {
  subject: string;
  description: string;
  requestedBy: string;
  createdAt: string;
  siteId: string;
  previewUrl: string;'''

content = content.replace(old_sig, new_sig)

# 2. Add date formatting after function starts
old_start = '''}): string {
  return `<!DOCTYPE html'''

new_start = '''}): string {
  const changeDate = new Date(opts.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });

  return `<!DOCTYPE html'''

content = content.replace(old_start, new_start)

# 3. Add summary box after "Guten Tag,"
old_greeting = '''<p style="margin:0 0 24px;font-size:16px;">Guten Tag,</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      ich habe Ihre Anfrage bearbeitet: <strong>&ldquo;${opts.description}&rdquo;</strong>
    </p>'''

new_greeting = '''<p style="margin:0 0 24px;font-size:16px;">Guten Tag,</p>

    <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Zusammenfassung Ihrer Anfrage</p>
      <p style="margin:0 0 8px;font-size:15px;"><strong>Betreff:</strong> ${opts.subject}</p>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.5;"><strong>Beschreibung:</strong> ${opts.description}</p>
      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;"><strong>Gestellt am:</strong> ${changeDate}</p>
      <p style="margin:0;font-size:14px;color:#6b7280;"><strong>Website:</strong> ${opts.siteId}.minicon.eu</p>
    </div>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      ich habe Ihre Anfrage bearbeitet und auf der Vorschau eingespielt.
    </p>'''

content = content.replace(old_greeting, new_greeting)

# 4. Update the function call to pass new parameters
old_call = '''const approvalHtml = buildApprovalEmailHtml({
    description: cr.description,
    previewUrl,
    approveUrl,
    rejectUrl,
    botName,
    company,
  });'''

new_call = '''const approvalHtml = buildApprovalEmailHtml({
    subject: cr.subject,
    description: cr.description,
    requestedBy: cr.requestedBy,
    createdAt: cr.createdAt.toISOString(),
    siteId,
    previewUrl,
    approveUrl,
    rejectUrl,
    botName,
    company,
  });'''

content = content.replace(old_call, new_call)

# Write back
with open('/opt/build/minicon-website-service/src/routes/cr.routes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated successfully!")
