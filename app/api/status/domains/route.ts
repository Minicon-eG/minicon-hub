import { NextResponse } from 'next/server';

export async function GET() {
  const UPTIME_KUMA_URL = process.env.UPTIME_KUMA_URL || 'http://localhost:3001';
  const API_KEY = process.env.UPTIME_KUMA_API_KEY || 'uk1_pkcyZM0lDxNlv7UNTYgX8eCe_rOWLALUE4I9hRIc';

  try {
    const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');
    const response = await fetch(`${UPTIME_KUMA_URL}/metrics`, {
      headers: { 'Authorization': authHeader },
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      return NextResponse.json({ monitors: [], source: 'uptime-kuma-error' }, { status: 200 });
    }

    const text = await response.text();
    const monitors = [];
    const regex = /monitor_status\{[^}]*name="([^"]+)"[^}]*\}\s+(\d+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      monitors.push({
        name: match[1],
        status: match[2] === '1' ? 'active' : 'down',
      });
    }

    return NextResponse.json({ monitors, source: 'uptime-kuma' });
  } catch (error) {
    // Graceful fallback ÔÇö don't fail when Uptime Kuma is unreachable
    return NextResponse.json({ monitors: [], source: 'unreachable' }, { status: 200 });
  }
}
