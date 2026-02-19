
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const queryOverpass = require('query-overpass');

// Function to run discovery
async function runDiscovery() {
  console.log('--- Running Discovery ---');
  
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

  return new Promise((resolve, reject) => {
    queryOverpass(OVERPASS_QUERY, async (error, data) => {
      if (error) {
        console.error('Discovery Error:', error);
        reject(error);
        return;
      }

      console.log(`Discovery: Found ${data.features.length} items from Overpass.`);
      
      let newCompanies = 0;
      
      for (const feature of data.features) {
        const tags = feature.properties.tags;
        if (!tags || !tags.name) continue;

        let domain = '';
        if (tags.website) {
            try {
                // simple extraction
                domain = tags.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            } catch (e) {
                domain = `${tags.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local`;
            }
        } else {
             domain = `${tags.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local`;
        }

        const existing = await prisma.company.findFirst({
            where: { domain: domain }
        });

        if (!existing) {
             await prisma.company.create({
                 data: {
                     name: tags.name,
                     domain: domain,
                     industry: tags.amenity || 'Restaurant',
                     address: tags['addr:street'] || 'Unknown Address'
                 }
             });
             console.log(`  -> New Company: ${tags.name} (${domain})`);
             newCompanies++;
        }
      }
      
      console.log(`Discovery complete. Added ${newCompanies} companies.`);
      resolve(newCompanies);
    });
  });
}

// Main execution
async function main() {
    try {
        await runDiscovery();
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
