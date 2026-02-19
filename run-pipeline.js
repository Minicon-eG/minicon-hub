
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock discovery for now since we can't easily import the route handler 
// without Next.js server context in a standalone script.
// But wait, the route handler imports `query-overpass`. I can just copy that logic?
// Or I can use `fetch` to call the local API if the server was running.
// But the server is NOT running.
// So I should implement the logic directly here or import it.
// Importing next.js route handlers in a standalone script is tricky.

// Let's implement a simple "Check Status" and "Mock Trigger" for now.

async function main() {
  console.log('--- Autonomous Deployment Platform Status Check ---');

  // 1. Check DB Status
  try {
    const companies = await prisma.company.findMany({
      include: {
        analyses: true,
        deployments: true
      }
    });

    const pendingAnalysis = companies.filter(c => c.analyses.length === 0);
    const analyzing = companies.filter(c => c.analyses.some(a => a.status === 'analyzing'));
    const pendingDeployment = companies.filter(c => c.analyses.some(a => a.status === 'completed') && c.deployments.length === 0);
    const deploying = companies.filter(c => c.deployments.some(d => d.status === 'deploying'));
    const live = companies.filter(c => c.deployments.some(d => d.status === 'live'));

    console.log(`\nSummary:`);
    console.log(`- Total Companies: ${companies.length}`);
    console.log(`- Pending Analysis: ${pendingAnalysis.length}`);
    console.log(`- Analyzing: ${analyzing.length}`);
    console.log(`- Pending Deployment: ${pendingDeployment.length}`);
    console.log(`- Deploying: ${deploying.length}`);
    console.log(`- Live: ${live.length}`);

    // 2. Report Details
    if (pendingAnalysis.length > 0) {
      console.log(`\nPending Analysis:`);
      pendingAnalysis.forEach(c => console.log(`  - ${c.name} (${c.domain})`));
    }
    
    // 3. Trigger Next Steps (Mocked)
    // In a real scenario, this would call the actual agent functions.
    // For now, we will simulate the "Analysis" step if there are pending items.
    
    if (pendingAnalysis.length > 0) {
      console.log(`\n[ACTION] Triggering analysis for ${pendingAnalysis.length} companies...`);
      // Simulating analysis start
      for (const company of pendingAnalysis) {
        // Create a dummy analysis record
        await prisma.websiteAnalysis.create({
          data: {
            companyId: company.id,
            status: 'analyzing',
            score: 0,
            issues: 'Analysis started by cron',
            legalCheckStatus: 'pending'
          }
        });
        console.log(`  -> Started analysis for ${company.name}`);
      }
    } else {
        console.log('\n[INFO] No pending analyses.');
    }

    if (pendingDeployment.length > 0) {
         console.log(`\n[ACTION] Triggering deployment for ${pendingDeployment.length} companies...`);
         // Trigger deployment logic here
         for (const company of pendingDeployment) {
             await prisma.deployment.create({
                 data: {
                     companyId: company.id,
                     status: 'queued'
                 }
             });
             console.log(`  -> Queued deployment for ${company.name}`);
         }
    }

  } catch (e) {
    console.error('Error checking status:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
