const { PrismaClient } = require('@prisma/client');
const https = require('https');
const prisma = new PrismaClient();

// Function to query Overpass API with custom timeout
async function queryOverpassDirect(query, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const postData = query;
    
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: timeoutMs
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Function to run discovery
async function runDiscovery() {
  console.log('--- Running Discovery v2 (with better timeout handling) ---');
  
  const OVERPASS_QUERY = `
[out:json];
area["name"="Dahn"]->.searchArea;
(
  node["amenity"="restaurant"](area.searchArea);
  way["amenity"="restaurant"](area.searchArea);
  relation["amenity"="restaurant"](area.searchArea);
);
out center;
  `;

  try {
    console.log('Querying Overpass API...');
    const data = await queryOverpassDirect(OVERPASS_QUERY, 60000); // 60s timeout
    
    const features = data.elements || [];
    console.log(`Discovery: Found ${features.length} items from Overpass.`);
    
    let newCompanies = 0;
    
    for (const element of features) {
      const tags = element.tags;
      if (!tags || !tags.name) continue;

      let domain = '';
      if (tags.website) {
        try {
          domain = tags.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        } catch (e) {
          domain = `${tags.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local`;
        }
      } else {
        domain = `${tags.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local`;
      }

      // Check by NAME first (case-insensitive, normalized)
      const normalizedName = tags.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const existing = await prisma.company.findFirst({
        where: {
          name: {
            equals: tags.name,
            mode: 'insensitive'
          }
        }
      });

      if (!existing) {
        await prisma.company.create({
          data: {
            name: tags.name,
            domain: domain,
            industry: tags.amenity || 'Restaurant',
            address: tags['addr:street'] || 'Unknown Address',
            hasOwnWebsite: tags.website ? true : false
          }
        });
        console.log(`  ✓ New Company: ${tags.name} (${domain})`);
        newCompanies++;
      } else {
        // Update if we found a real website (better than .local or no domain)
        if (tags.website && existing.domain && existing.domain.includes('.local')) {
          await prisma.company.update({
            where: { id: existing.id },
            data: {
              domain: domain,
              hasOwnWebsite: true
            }
          });
          console.log(`  ↑ Updated: ${tags.name} with real domain (${domain})`);
        } else {
          console.log(`  - Exists: ${tags.name}`);
        }
      }
    }
    
    console.log(`\nDiscovery complete. Added ${newCompanies} new companies (${features.length - newCompanies} already existed).`);
    return newCompanies;
  } catch (error) {
    console.error('Discovery Error:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await runDiscovery();
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
