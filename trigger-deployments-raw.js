
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Triggering Deployments (Raw) ---');

  try {
    // Find companies with completed analysis but NO deployments
    // We can use Prisma for reading, that seems fine.
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
      console.log('Queuing them for deployment...');
      
      for (const company of readyForDeployment) {
        // Use create without relation connection, passing scalar ID directly.
        // Wait, the previous attempt did pass scalar ID directly.
        
        // Let's try raw MongoDB insert via Prisma if possible, or just try to use 'connect' syntax
        // which might force a different path? No, 'connect' usually implies transaction for consistency.
        
        // Let's try to just insert using create but maybe WITHOUT the relation field in the select?
        // Actually, let's try to use update on Company to add a deployment? No, that's definitely a nested write.
        
        // If the previous error was "Prisma needs to perform transactions", it means the engine decided it needs one.
        // Maybe because of @relation?
        
        // Let's try to create a deployment but perform it using a raw query if Prisma supports it for Mongo.
        // prisma.$runCommandRaw({ insert: "Deployment", documents: [...] })
        
        const timestamp = new Date().toISOString();
        
        try {
            await prisma.$runCommandRaw({
                insert: "Deployment",
                documents: [{
                    companyId: { "$oid": company.id },
                    status: "queued",
                    createdAt: { "$date": timestamp },
                    updatedAt: { "$date": timestamp }
                }]
            });
             console.log(`- Queued deployment for: ${company.name} (via raw insert)`);
        } catch (rawError) {
            console.error(`Failed raw insert for ${company.name}:`, rawError);
        }

      }
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
