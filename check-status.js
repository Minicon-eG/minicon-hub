
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const companies = await prisma.company.count();
    const pendingAnalysis = await prisma.websiteAnalysis.count({
      where: { status: 'pending' }
    });
    const completedAnalysis = await prisma.websiteAnalysis.count({
      where: { status: 'completed' }
    });
    const pendingDeployment = await prisma.deployment.count({
      where: { status: 'queued' }
    });
    const liveDeployments = await prisma.deployment.count({
      where: { status: 'live' }
    });

    console.log(`Companies Discovered: ${companies}`);
    console.log(`Pending Analysis: ${pendingAnalysis}`);
    console.log(`Analyzed (Ready for Deployment?): ${completedAnalysis}`); // Depending on logic
    console.log(`Pending Deployment: ${pendingDeployment}`);
    console.log(`Live Deployments: ${liveDeployments}`);

    // Fetch details for pending tasks
    const pendingAnalysesDetails = await prisma.websiteAnalysis.findMany({
      where: { status: 'pending' },
      include: { company: true },
      take: 5
    });

    // Find companies WITHOUT any analysis
    const companiesWithoutAnalysis = await prisma.company.findMany({
      where: {
        analyses: {
          none: {}
        }
      }
    });

    console.log(`Companies without Analysis: ${companiesWithoutAnalysis.length}`);
    if (companiesWithoutAnalysis.length > 0) {
      console.log('--- Companies needing Analysis ---');
      companiesWithoutAnalysis.forEach(c => {
        console.log(`- ${c.name} (${c.domain}) [ID: ${c.id}]`);
      });
    }
    
    // Fetch pending deployments
     const pendingDeploymentsDetails = await prisma.deployment.findMany({
      where: { status: 'queued' },
      include: { company: true },
      take: 5
    });
    
    // List all companies with their status
    const allCompanies = await prisma.company.findMany({
      include: {
        analyses: true,
        deployments: true
      }
    });

    console.log('\n--- All Companies ---');
    allCompanies.forEach(c => {
      const analysisStatus = c.analyses.map(a => a.status).join(', ') || 'None';
      const deploymentStatus = c.deployments.map(d => d.status).join(', ') || 'None';
      console.log(`- ${c.name} (${c.domain}) [Analysis: ${analysisStatus}] [Deployment: ${deploymentStatus}]`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
