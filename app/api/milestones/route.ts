import { NextResponse } from 'next/server';

const JIRA_INSTANCE = 'https://minicon.atlassian.net';
const JIRA_USER = 'michael.nikolaus@minicon.eu';
const JIRA_TOKEN = 'ATATT3xFfGF0tD6u7hKMbd565a7PxeVFEr4F3GPUKAfQz40uACVmOT9W97rphKAv-N1Q6cQmFH32YzSyaDtOs72UvH-JapTlhCT993O2ZqPuECt5VXXEb1ODPE-4FR9jeTiMwSZZ8HLUuAPrVXIIQBZcWHbMWidirDt4IUPcLb8_QrvNvcWuvEQ=235DD815';
const API_URL = process.env.API_URL || 'https://api.minicon.eu';
const API_KEY = process.env.API_KEY || 'atlas-admin-2026';

interface Milestone {
  name: string;
  target: number;
  deadline: string;
  current: number;
  pipelineBreakdown: Record<string, number>;
}

async function jiraCount(jql: string): Promise<number> {
  const auth = Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString('base64');
  try {
    const res = await fetch(`${JIRA_INSTANCE}/rest/api/3/search/jql`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ jql, maxResults: 1, fields: ['summary'] }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total || 0;
  } catch { return 0; }
}

async function getCustomerStats() {
  try {
    const res = await fetch(`${API_URL}/api/admin/customers`, {
      headers: { 'x-api-key': API_KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) return { total: 0, active: 0, promoted: 0, onboarding: 0, pipeline: 0 };
    const data = await res.json();
    const customers = data.customers || [];
    return {
      total: customers.length,
      active: customers.filter((c: any) => c.status === 'active').length,
      promoted: customers.filter((c: any) => c.status === 'promoted').length,
      onboarding: customers.filter((c: any) => c.status === 'onboarding').length,
      pipeline: customers.filter((c: any) => c.status === 'pipeline').length,
    };
  } catch { return { total: 0, active: 0, promoted: 0, onboarding: 0, pipeline: 0 }; }
}

export async function GET() {
  const [
    totalTickets,
    ticketsDone,
    discoveryNew,
    discoveryDone,
    buildDone,
    qaPassed,
    reviewDone,
    customers,
  ] = await Promise.all([
    jiraCount('project=DAHN'),
    jiraCount('project=DAHN AND status = Done'),
    jiraCount('project=DAHN AND labels = discovery-new AND labels not in (discovery-done)'),
    jiraCount('project=DAHN AND labels = discovery-done AND labels not in (build-done)'),
    jiraCount('project=DAHN AND labels = build-done AND labels not in (qa-passed, qa-failed)'),
    jiraCount('project=DAHN AND labels = qa-passed AND labels not in (review-done, design-issues)'),
    jiraCount('project=DAHN AND labels = review-done'),
    getCustomerStats(),
  ]);

  // "Live" = sites that have passed through the pipeline (build-done or further)
  const sitesLive = customers.active + customers.promoted;
  const sitesBuilt = customers.onboarding + customers.active + customers.promoted;

  const milestones: Milestone[] = [
    {
      name: 'Dahn komplett',
      target: 50,
      deadline: '2026-04-30',
      current: sitesBuilt,
      pipelineBreakdown: {
        'Discovery (neu)': discoveryNew,
        'Discovery (fertig)': discoveryDone,
        'Gebaut': buildDone,
        'QA bestanden': qaPassed,
        'Review fertig': reviewDone,
        'Live (aktiv/beworben)': sitesLive,
      },
    },
    {
      name: '1000 Websites',
      target: 1000,
      deadline: '2026-12-31',
      current: sitesBuilt,
      pipelineBreakdown: {
        'Kunden gesamt': customers.total,
        'In Pipeline': customers.pipeline,
        'Im Aufbau': customers.onboarding,
        'Beworben': customers.promoted,
        'Aktiv (bezahlt)': customers.active,
      },
    },
  ];

  const pipeline = {
    totalTickets,
    ticketsDone,
    stages: {
      discoveryNew,
      discoveryDone,
      buildDone,
      qaPassed,
      reviewDone,
    },
    customers,
  };

  // Velocity: sites per day needed
  const now = new Date();
  const m1Deadline = new Date('2026-04-30');
  const m2Deadline = new Date('2026-12-31');
  const daysToM1 = Math.max(1, Math.ceil((m1Deadline.getTime() - now.getTime()) / 86400000));
  const daysToM2 = Math.max(1, Math.ceil((m2Deadline.getTime() - now.getTime()) / 86400000));

  const velocity = {
    milestone1: {
      remaining: Math.max(0, 50 - sitesBuilt),
      daysLeft: daysToM1,
      perDay: Math.ceil(Math.max(0, 50 - sitesBuilt) / daysToM1 * 10) / 10,
    },
    milestone2: {
      remaining: Math.max(0, 1000 - sitesBuilt),
      daysLeft: daysToM2,
      perDay: Math.ceil(Math.max(0, 1000 - sitesBuilt) / daysToM2 * 10) / 10,
    },
  };

  return NextResponse.json({ milestones, pipeline, velocity, updatedAt: new Date().toISOString() });
}
