import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const deployments = await prisma.deployment.findMany();
  return NextResponse.json(deployments);
}

export async function POST(req: Request) {
  const data = await req.json();
  const deployment = await prisma.deployment.create({
    data: {
      companyId: data.companyId,
      status: data.status,
      liveUrl: data.liveUrl,
    },
  });
  return NextResponse.json(deployment);
}
