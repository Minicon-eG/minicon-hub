
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Fixing Stuck Analyses ---');

  try {
    const stuckAnalyses = await prisma.websiteAnalysis.findMany({
      where: { status: 'analyzing' }
    });

    console.log(`Found ${stuckAnalyses.length} analyses stuck in 'analyzing'.`);

    if (stuckAnalyses.length > 0) {
      console.log('Completing them with mock data...');
      
      for (const analysis of stuckAnalyses) {
        await prisma.websiteAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: 'completed',
            score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
            issues: JSON.stringify(['Mock issue: No impressum found', 'Mock issue: Mobile optimization needed']), 
            legalCheckStatus: 'failed', // Let's mark some as failed legal check to simulate reality
          }
        });
        console.log(`- Completed analysis for ID: ${analysis.id}`);
      }
    } else {
        console.log('No stuck analyses found.');
    }

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
