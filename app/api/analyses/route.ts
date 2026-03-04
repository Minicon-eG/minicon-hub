import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const analyses = await prisma.websiteAnalysis.findMany();
  return NextResponse.json(analyses);
}

export async function POST(req: Request) {
  const data = await req.json();
  const analysis = await prisma.websiteAnalysis.create({
    data: {
      companyId: data.companyId,
      status: data.status,
      score: data.score,
      issues: data.issues,
      legalCheckStatus: data.legalCheckStatus || 'pending',
    },
  });
  return NextResponse.json(analysis);
}
