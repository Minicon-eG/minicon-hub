import { Router, Request, Response } from "express";
import crypto from "crypto";
import { ChangeRequest } from "../models/change-request.model";
import { Customer } from "../models/customer.model";
import { sendEmail } from "../services/email.service";

const router = Router();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";
const BASE_URL = process.env.BASE_URL || "";

function htmlResponse(res: Response, statusCode: number, message: string): void {
  res
    .status(statusCode)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .send(`<!doctype html><html><body style="font-family: sans-serif; padding: 24px;">${message}</body></html>`);
}

function approvalLinks(baseUrl: string, token: string): { approveUrl: string; rejectUrl: string } {
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return {
    approveUrl: `${normalized}/api/cr/approve?token=${encodeURIComponent(token)}`,
    rejectUrl: `${normalized}/api/cr/reject?token=${encodeURIComponent(token)}`,
  };
}

async function dispatchProductionDeploy(siteId: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error("[cr] GITHUB_TOKEN missing");
    return false;
  }

  const res = await fetch(`https://api.github.com/repos/Minicon-eG/website-${siteId}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_type: "deploy-production",
      client_payload: { ref: "main" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[cr] repository_dispatch failed for ${siteId}: ${res.status} ${body}`);
    return false;
  }

  return true;
}

function buildApprovalEmailHtml(opts: {
  description: string;
  previewUrl: string;
  approveUrl: string;
  rejectUrl: string;
  botName: string;
  company: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;color:#1a1a1a;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <p style="margin:0 0 24px;font-size:16px;">Guten Tag,</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      ich habe Ihre Anfrage bearbeitet: <strong>&ldquo;${opts.description}&rdquo;</strong>
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
      Die &Auml;nderung wurde auf unserer Vorschau eingespielt und wartet auf Ihre Freigabe.
      Schauen Sie sich die Vorschau an &mdash; wenn alles passt, k&ouml;nnen Sie die &Auml;nderung
      direkt live schalten.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${opts.previewUrl}"
         style="display:inline-block;background:#4F46E5;color:white;text-decoration:none;
                padding:14px 36px;border-radius:8px;font-weight:600;font-size:15px;">
        Vorschau ansehen &rarr;
      </a>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 12px;font-size:13px;color:#6b7280;font-weight:600;
                text-transform:uppercase;letter-spacing:0.05em;">Ihre Entscheidung</p>
      <table style="width:100%;border-collapse:separate;border-spacing:8px;"><tr>
        <td style="width:50%;text-align:center;">
          <a href="${opts.approveUrl}"
             style="display:block;background:#10B981;color:white;text-decoration:none;
                    padding:14px;border-radius:8px;font-weight:700;font-size:15px;">
            &#10003; Genehmigen &amp; Live schalten
          </a>
        </td>
        <td style="width:50%;text-align:center;">
          <a href="${opts.rejectUrl}"
             style="display:block;background:#EF4444;color:white;text-decoration:none;
                    padding:14px;border-radius:8px;font-weight:700;font-size:15px;">
            &#10005; Ablehnen
          </a>
        </td>
      </tr></table>
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
      Diese Genehmigung ist 7 Tage g&uuml;ltig. Bei R&uuml;ckfragen antworten Sie einfach auf diese E-Mail.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="margin:0;font-size:14px;color:#374151;">
      Mit freundlichen Gr&uuml;&szlig;en,<br>
      <strong>${opts.botName}</strong><br>
      <span style="color:#9ca3af;font-size:13px;">Website-Agent f&uuml;r ${opts.company}</span>
    </p>
  </div>
  <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px;">
    Bereitgestellt von
    <a href="https://minicon.eu" style="color:#4F46E5;text-decoration:none;">Minicon eG</a>
  </p>
</body>
</html>`;
}

/**
 * POST /api/internal/cr-deployed
 */
router.post("/internal/cr-deployed", async (req: Request, res: Response): Promise<void> => {
  const headerSecret = req.header("X-Internal-Secret") || "";
  if (!INTERNAL_SECRET || headerSecret !== INTERNAL_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const siteId = typeof req.body?.siteId === "string" ? req.body.siteId.trim() : "";
  const previewUrl = typeof req.body?.previewUrl === "string" ? req.body.previewUrl.trim() : "";

  if (!siteId || !previewUrl) {
    res.status(400).json({ error: "Body muss { siteId, previewUrl } enthalten" });
    return;
  }

  const cr = await ChangeRequest.findOne({ siteId, status: "preview" }).sort({ createdAt: -1 });
  if (!cr) {
    res.status(404).json({ error: "Keine passende Change Request gefunden" });
    return;
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const hostBaseUrl = BASE_URL || `${req.protocol}://${req.get("host") || ""}`;
  const { approveUrl, rejectUrl } = approvalLinks(hostBaseUrl, token);

  cr.previewUrl = previewUrl;
  cr.approvalToken = token;
  cr.approvalTokenExpiresAt = expiresAt;
  await cr.save();

  // Load bot persona for personalized email
  let botName = "Ihr Website-Team";
  let company = siteId;
  try {
    const customer = await Customer.findById(siteId);
    if (customer) {
      botName = (customer as any).botPersona?.name || botName;
      company = (customer as any).company || company;
    }
  } catch (_e) { /* ignore */ }

  const approvalHtml = buildApprovalEmailHtml({
    description: cr.description,
    previewUrl,
    approveUrl,
    rejectUrl,
    botName,
    company,
  });

  try {
    await sendEmail({
      to: cr.requestedBy,
      subject: `Re: ${cr.subject} \u2014 Vorschau bereit`,
      fromAddress: `${siteId}@support.minicon.eu`,
      fromName: botName,
      html: approvalHtml,
      text: `Guten Tag,\n\ndie Änderung "${cr.description}" wurde in der Vorschau eingespielt.\n\nVorschau ansehen: ${previewUrl}\n\nGenehmigen: ${approveUrl}\nAblehnen: ${rejectUrl}\n\nMit freundlichen Grüßen,\n${botName}\nWebsite-Agent für ${company}`,
    });
    console.log(`[cr] Approval email sent to ${cr.requestedBy} for ${siteId}`);
  } catch (e) {
    console.error("[cr] Failed to send preview email:", e);
  }

  res.json({ ok: true });
});

/**
 * POST /api/internal/cr-issue-created
 * Called by customer-bot after creating a GitHub Issue.
 * Stores issueNumber + issueUrl and sets CR to status "preview".
 */
router.post("/internal/cr-issue-created", async (req: Request, res: Response): Promise<void> => {
  const headerSecret = req.header("X-Internal-Secret") || "";
  if (!INTERNAL_SECRET || headerSecret !== INTERNAL_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { crId, issueNumber, issueUrl } = req.body || {};
  if (!crId || !issueNumber || !issueUrl) {
    res.status(400).json({ error: "Body muss { crId, issueNumber, issueUrl } enthalten" });
    return;
  }

  const cr = await ChangeRequest.findById(crId);
  if (!cr) {
    res.status(404).json({ error: "Change Request nicht gefunden" });
    return;
  }

  cr.set("issueNumber", issueNumber);
  cr.set("issueUrl", issueUrl);
  cr.status = "preview";
  cr.set("implementAfter", new Date());
  await cr.save();

  console.log(`[cr] Issue created for CR ${crId}: #${issueNumber} (${issueUrl}), status \u2192 preview`);
  res.json({ ok: true });
});

/**
 * GET /api/cr/approve?token=xxx
 */
router.get("/cr/approve", async (req: Request, res: Response): Promise<void> => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    htmlResponse(res, 400, "Ungültiger Token.");
    return;
  }

  const cr = await ChangeRequest.findOne({ approvalToken: token });
  if (!cr || !cr.approvalTokenExpiresAt || cr.approvalTokenExpiresAt.getTime() <= Date.now()) {
    htmlResponse(res, 400, "Token ungültig oder abgelaufen.");
    return;
  }

  cr.status = "approved";
  cr.set("approvedAt", new Date());
  cr.approvalToken = undefined;
  cr.approvalTokenExpiresAt = undefined;
  await cr.save();

  await dispatchProductionDeploy(cr.siteId);

  let botName = "Ihr Website-Team";
  let company = cr.siteId;
  try {
    const customer = await Customer.findById(cr.siteId);
    if (customer) {
      botName = (customer as any).botPersona?.name || botName;
      company = (customer as any).company || company;
    }
  } catch (_e) { /* ignore */ }

  try {
    await sendEmail({
      to: cr.requestedBy,
      subject: `Re: ${cr.subject} \u2014 Ihre Änderung wird live geschaltet`,
      fromAddress: `${cr.siteId}@support.minicon.eu`,
      fromName: botName,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;color:#1a1a1a;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#10B981;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;text-align:center;">&#10003;</div>
    </div>
    <p style="margin:0 0 16px;font-size:16px;text-align:center;font-weight:600;">Genehmigung erhalten &mdash; danke!</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;text-align:center;color:#374151;">
      Die &Auml;nderung <strong>&ldquo;${cr.description}&rdquo;</strong> wird jetzt live geschaltet.
      In wenigen Minuten ist sie auf Ihrer Website sichtbar.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="margin:0;font-size:14px;color:#374151;">
      Mit freundlichen Gr&uuml;&szlig;en,<br>
      <strong>${botName}</strong><br>
      <span style="color:#9ca3af;font-size:13px;">Website-Agent f&uuml;r ${company}</span>
    </p>
  </div>
</body></html>`,
      text: `Genehmigung erhalten!\n\nDie Änderung "${cr.description}" wird jetzt live geschaltet.\n\nMit freundlichen Grüßen,\n${botName}`,
    });
  } catch (e) {
    console.error("[cr] Failed to send approval confirmation email:", e);
  }

  htmlResponse(res, 200, `<div style="text-align:center;padding:40px;">
    <div style="font-size:48px;margin-bottom:16px;">&#10003;</div>
    <h2 style="color:#10B981;">Genehmigt!</h2>
    <p>Die Änderung wird jetzt live geschaltet. Sie erhalten eine Bestätigungs-E-Mail.</p>
  </div>`);
});

/**
 * GET /api/cr/reject?token=xxx
 */
router.get("/cr/reject", async (req: Request, res: Response): Promise<void> => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    htmlResponse(res, 400, "Ungültiger Token.");
    return;
  }

  const cr = await ChangeRequest.findOne({ approvalToken: token });
  if (!cr || !cr.approvalTokenExpiresAt || cr.approvalTokenExpiresAt.getTime() <= Date.now()) {
    htmlResponse(res, 400, "Token ungültig oder abgelaufen.");
    return;
  }

  cr.status = "rejected";
  cr.set("rejectedAt", new Date());
  cr.approvalToken = undefined;
  cr.approvalTokenExpiresAt = undefined;
  await cr.save();

  let botName = "Ihr Website-Team";
  let company = cr.siteId;
  try {
    const customer = await Customer.findById(cr.siteId);
    if (customer) {
      botName = (customer as any).botPersona?.name || botName;
      company = (customer as any).company || company;
    }
  } catch (_e) { /* ignore */ }

  try {
    await sendEmail({
      to: cr.requestedBy,
      subject: `Re: ${cr.subject} \u2014 Ablehnung erhalten`,
      fromAddress: `${cr.siteId}@support.minicon.eu`,
      fromName: botName,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;color:#1a1a1a;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Guten Tag,</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      wir haben Ihre Ablehnung erhalten. Die &Auml;nderung <strong>&ldquo;${cr.description}&rdquo;</strong>
      wird nicht live geschaltet.
    </p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
      M&ouml;chten Sie eine andere &Auml;nderung beauftragen oder haben Sie R&uuml;ckfragen?
      Antworten Sie einfach auf diese E-Mail.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="margin:0;font-size:14px;color:#374151;">
      Mit freundlichen Gr&uuml;&szlig;en,<br>
      <strong>${botName}</strong><br>
      <span style="color:#9ca3af;font-size:13px;">Website-Agent f&uuml;r ${company}</span>
    </p>
  </div>
</body></html>`,
      text: `Guten Tag,\n\nwir haben Ihre Ablehnung erhalten. Die Änderung "${cr.description}" wird nicht live geschaltet.\n\nBei Rückfragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen,\n${botName}`,
    });
  } catch (e) {
    console.error("[cr] Failed to send rejection confirmation email:", e);
  }

  htmlResponse(res, 200, `<div style="text-align:center;padding:40px;">
    <h2 style="color:#EF4444;">Abgelehnt</h2>
    <p>Wir haben Ihre Ablehnung erhalten und werden uns bei Ihnen melden.</p>
  </div>`);
});

export default router;
