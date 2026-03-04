import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentName, summary } = body;

    if (!agentName || !summary) {
      return NextResponse.json({ error: 'agentName and summary required' }, { status: 400 });
    }

    const activity = await prisma.agentActivity.create({
      data: { agentName, summary },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Failed to create agent activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const hours = parseInt(searchParams.get('hours') || '72', 10);

  if (!name) {
    return NextResponse.json({ error: 'name parameter required' }, { status: 400 });
  }

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  try {
    const activities = await prisma.agentActivity.findMany({
      where: {
        agentName: { equals: name, mode: 'insensitive' },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch agent activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
