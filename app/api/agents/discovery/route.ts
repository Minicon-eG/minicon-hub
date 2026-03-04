import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// @ts-ignore
import queryOverpass from 'query-overpass';

const OVERPASS_QUERY = `
  [out:json];
  area["name"="Dahn"]->.searchArea;
  (
    node["amenity"="restaurant"](area.searchArea);
    way["amenity"="restaurant"](area.searchArea);
    relation["amenity"="restaurant"](area.searchArea);
    node["shop"](area.searchArea);
    way["shop"](area.searchArea);
    relation["shop"](area.searchArea);
    node["craft"](area.searchArea);
    way["craft"](area.searchArea);
    relation["craft"](area.searchArea);
  );
  out center;
`;

export async function POST() {
  try {
    // 1. Fetch data from Overpass API
    const osmData: any = await new Promise((resolve, reject) => {
      queryOverpass(OVERPASS_QUERY, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });

    const companies = [];

    // 2. Process OSM data
    if (osmData && osmData.features) {
      for (const feature of osmData.features) {
        const tags = feature.properties.tags;
        
        if (!tags || !tags.name) continue; 

        // Extract domain from website or generate a placeholder
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

        // Check if company already exists
        const existing = await prisma.company.findFirst({
          where: { 
             domain: domain 
          },
        });

        if (existing) {
          companies.push(existing);
          continue;
        }

        // Map to Company schema
        const street = tags['addr:street'] || '';
        const housenumber = tags['addr:housenumber'] || '';
        const postcode = tags['addr:postcode'] || '';
        const city = tags['addr:city'] || 'Dahn';
        
        const fullAddress = `${street} ${housenumber}, ${postcode} ${city}`.trim().replace(/^,/, '').trim();

        const newCompany = await prisma.company.create({
          data: {
            name: tags.name,
            domain: domain,
            industry: tags.amenity || tags.shop || tags.craft || 'Unknown',
            address: fullAddress || 'Unknown Address',
            contactEmail: tags.email || null,
            managingDirector: tags.operator || null,
          },
        });

        companies.push(newCompany);
      }
    }

    return NextResponse.json({ 
      message: `Discovery run successful. Processed ${companies.length} companies.`, 
      companies: companies 
    });

  } catch (error) {
    console.error('Error in discovery agent:', error);
    return NextResponse.json({ error: 'Failed to discover companies', details: String(error) }, { status: 500 });
  }
}
