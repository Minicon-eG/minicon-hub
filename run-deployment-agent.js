
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Running Deployment Agent (Standalone) ---');

  try {
    // 1. Find all queued deployments
    // Read operations should be fine
    const queuedDeployments = await prisma.deployment.findMany({
      where: {
        status: 'queued',
      },
      include: {
        company: true,
      },
    });

    console.log(`Found ${queuedDeployments.length} queued deployments.`);

    if (queuedDeployments.length === 0) {
        return;
    }

    // 2. Process each deployment
    for (const deployment of queuedDeployments) {
      const company = deployment.company;
      // Use a fallback domain if company.domain is missing
      const domain = company.domain || `${company.name.replace(/\s+/g, '-').toLowerCase()}.minicon.eu`;
      const liveUrl = `https://${domain}`; 

      console.log(`Deploying ${company.name} to ${liveUrl}...`);

      const timestamp = new Date().toISOString();

      try {
        // Try standard update first
        await prisma.deployment.update({
             where: { id: deployment.id },
             data: {
                 status: 'live',
                 liveUrl: liveUrl,
             }
        });
         console.log(`- [SUCCESS] Standard update worked for ${company.name}`);
      } catch (e) {
         console.log(`- [INFO] Standard update failed, trying raw update for ${company.name}`);
         
         // Fallback to raw update
          try {
            await prisma.$runCommandRaw({
                update: "Deployment",
                updates: [{
                    q: { _id: { "$oid": deployment.id } },
                    u: { 
                        "$set": { 
                            status: "live", 
                            liveUrl: liveUrl,
                            updatedAt: { "$date": timestamp }
                        } 
                    }
                }]
            });
            console.log(`- [SUCCESS] Raw update worked for ${company.name}`);
          } catch (rawError) {
             console.error(`- [ERROR] Both updates failed for ${company.name}:`, rawError);
          }
      }
    }

  } catch (error) {
    console.error('Deployment agent error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
