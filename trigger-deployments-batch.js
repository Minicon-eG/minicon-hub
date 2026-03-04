
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Triggering Deployments (Batch) ---');

  try {
    // Find companies with completed analysis but NO deployments
    const readyForDeployment = await prisma.company.findMany({
      where: {
        analyses: {
          some: { status: 'completed' }
        },
        deployments: {
          none: {}
        }
      }
    });

    console.log(`Found ${readyForDeployment.length} companies ready for deployment.`);

    if (readyForDeployment.length > 0) {
      console.log('Queuing them for deployment using createMany...');
      
      const deploymentData = readyForDeployment.map(company => ({
        companyId: company.id,
        status: 'queued'
      }));

      await prisma.deployment.createMany({
        data: deploymentData
      });
      
      console.log(`- Queued deployments for ${readyForDeployment.length} companies.`);
    } else {
        console.log('No companies ready for deployment.');
    }

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
