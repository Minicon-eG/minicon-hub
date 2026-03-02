const { PrismaClient } = require('@prisma/client');

const p = new PrismaClient();

let data = {};

p.$connect()
  .then(() => {
    return p.company.count();
  })
  .then(c => {
    data.companies = c;
    return p.websiteAnalysis.count();
  })
  .then(a => {
    data.analysesTotal = a;
    return p.websiteAnalysis.count({ where: { status: 'analyzing' }});
  })
  .then(r => {
    data.analysesRunning = r;
    return p.websiteAnalysis.count({ where: { status: 'completed' }});
  })
  .then(c => {
    data.analysesCompleted = c;
    return p.deployment.count();
  })
  .then(d => {
    data.deploymentsTotal = d;
    return p.deployment.count({ where: { status: 'live' }});
  })
  .then(l => {
    data.deploymentsLive = l;
    return p.deployment.count({ where: { status: { in: ['queued', 'deploying'] }}});
  })
  .then(pq => {
    data.deploymentsPending = pq;
    console.log(JSON.stringify(data));
    return p.$disconnect();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
