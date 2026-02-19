import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Find all queued deployments
    const queuedDeployments = await prisma.deployment.findMany({
      where: {
        status: 'queued',
      },
      include: {
        company: true, // We need company details to generate the site
      },
    });

    const results = [];

    // 2. Process each deployment
    for (const deployment of queuedDeployments) {
      const company = deployment.company;
      
      // Simulate site generation logic (e.g., creating files, uploading to Vercel/Netlify/S3)
      // For this task, we will just generate a mock URL based on the domain.
      // In a real app, this would involve calling a build process or a CMS API.
      
      const liveUrl = `https://${company.domain}`; // Mock URL for now

      // 3. Update deployment status
      const updatedDeployment = await prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: 'live',
          liveUrl: liveUrl,
          updatedAt: new Date(),
        },
      });

      results.push({
        company: company.name,
        url: liveUrl,
        status: 'live'
      });
      
      console.log(`Deployed ${company.name} to ${liveUrl}`);
    }

    return NextResponse.json({
      message: `Successfully processed ${results.length} deployments.`,
      deployments: results
    });

  } catch (error) {
    console.error('Deployment agent error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
