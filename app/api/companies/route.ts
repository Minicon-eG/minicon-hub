import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const companies = await prisma.company.findMany({
    include: {
      analyses: true,
      deployments: true,
    },
  });
  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  const data = await req.json();
  const company = await prisma.company.create({
    data: {
      name: data.name,
      domain: data.domain,
      industry: data.industry,
      address: data.address,
      contactEmail: data.contactEmail,
      managingDirector: data.managingDirector,
      registerEntry: data.registerEntry,
      vatId: data.vatId,
    },
  });
  return NextResponse.json(company);
}
