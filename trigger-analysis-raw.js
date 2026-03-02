
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Triggering Analysis (Raw) ---');

  try {
    // 1. Find companies with NO analysis
    const companiesWithoutAnalysis = await prisma.company.findMany({
      where: {
        analyses: {
          none: {}
        }
      }
    });

    console.log(`Found ${companiesWithoutAnalysis.length} companies without any analysis.`);

    if (companiesWithoutAnalysis.length > 0) {
      console.log('Starting analysis for them...');
      
      for (const company of companiesWithoutAnalysis) {
        const timestamp = new Date().toISOString();
        
        try {
            await prisma.$runCommandRaw({
                insert: "WebsiteAnalysis",
                documents: [{
                    companyId: { "$oid": company.id },
                    status: "analyzing",
                    score: 0,
                    issues: "Analysis started by raw trigger",
                    legalCheckStatus: "pending",
                    createdAt: { "$date": timestamp },
                    updatedAt: { "$date": timestamp }
                }]
            });
             console.log(`- Started analysis for: ${company.name} (via raw insert)`);
        } catch (rawError) {
            console.error(`Failed raw insert for ${company.name}:`, rawError);
        }
      }
    }

    // 2. Find companies stuck in 'analyzing' or 'pending' and move them to 'completed' (Mock logic)
    // This simulates the actual analysis agent finishing its job.
    const pendingAnalyses = await prisma.websiteAnalysis.findMany({
        where: {
            OR: [
                { status: 'analyzing' },
                { status: 'pending' }
            ]
        },
        include: { company: true }
    });

    console.log(`Found ${pendingAnalyses.length} pending/analyzing analyses.`);
    
    if (pendingAnalyses.length > 0) {
        console.log('Completing analyses (Mock)...');
        for (const analysis of pendingAnalyses) {
            const timestamp = new Date().toISOString();
            
            // Generate some mock results
            const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100
            
            try {
                await prisma.$runCommandRaw({
                    update: "WebsiteAnalysis",
                    updates: [{
                        q: { _id: { "$oid": analysis.id } },
                        u: { 
                            "$set": { 
                                status: "completed", 
                                score: mockScore,
                                legalCheckStatus: "passed",
                                updatedAt: { "$date": timestamp }
                            } 
                        }
                    }]
                });
                console.log(`- Completed analysis for: ${analysis.company.name} (Score: ${mockScore})`);
            } catch (rawError) {
                console.error(`Failed raw update for ${analysis.company.name}:`, rawError);
            }
        }
    }


  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
