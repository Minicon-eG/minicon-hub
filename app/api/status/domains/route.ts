import { NextResponse } from 'next/server';

export async function GET() {
  const UPTIME_KUMA_URL = 'http://localhost:3001';
  const API_KEY = 'uk1_pkcyZM0lDxNlv7UNTYgX8eCe_rOWLALUE4I9hRIc';

  try {
    // Try /metrics with Basic Auth (token as username)
    // Common for Uptime Kuma v1/v2 if exposed via basic auth or token
    const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');
    
    // Also try passing query param just in case
    const response = await fetch(`${UPTIME_KUMA_URL}/metrics`, {
      headers: {
        'Authorization': authHeader
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      console.error('Uptime Kuma returned:', response.status, response.statusText);
      // Fallback
      return NextResponse.json({ error: 'Failed to fetch status' }, { status: response.status });
    }

    const text = await response.text();
    const monitors = [];
    
    // Parse Prometheus metrics
    // monitor_status{name="...",...} 1
    const regex = /monitor_status\{[^}]*name="([^"]+)"[^}]*\}\s+(\d+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      monitors.push({
        name: match[1],
        status: match[2] === '1' ? 'active' : 'down', // Mapping 1->active (green), 0->down
        raw: match[0]
      });
    }

    return NextResponse.json({ monitors });
  } catch (error) {
    console.error('Error proxying Uptime Kuma:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
