
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const MEMORY_FILE = 'C:\\working\\gemini\\memory\\2026-02-19.md';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27018/minicon-hub';

async function main() {
  console.log(`Reading memory file: ${MEMORY_FILE}`);
  
  if (!fs.existsSync(MEMORY_FILE)) {
    console.error(`File not found: ${MEMORY_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
  const lines = content.split('\n');
  const activities = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      // Extract the summary (remove the dash and space)
      const summary = trimmed.substring(2).trim();
      
      // Determine the agent
      let agentName = 'Georg'; // Default
      
      const lowerSummary = summary.toLowerCase();
      
      if (
        lowerSummary.includes('deployment') ||
        lowerSummary.includes('server') ||
        lowerSummary.includes('infrastructure') ||
        lowerSummary.includes('database') ||
        lowerSummary.includes('docker') ||
        lowerSummary.includes('routing') ||
        lowerSummary.includes('ci/cd')
      ) {
        agentName = 'Atlas';
      } else if (
        lowerSummary.includes('code') ||
        lowerSummary.includes('development') ||
        lowerSummary.includes('feature') ||
        lowerSummary.includes('prisma') ||
        lowerSummary.includes('next.js')
      ) {
        agentName = 'Gemini';
      } else {
        agentName = 'Georg';
      }

      activities.push({
        agentName,
        summary,
        createdAt: new Date(),
      });
    }
  }

  console.log(`Found ${activities.length} activities.`);

  const client = new MongoClient(DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db(); // Uses the db name from connection string
    const collection = db.collection('AgentActivity');

    if (activities.length > 0) {
        const result = await collection.insertMany(activities);
        console.log(`Inserted ${result.insertedCount} activities into MongoDB directly.`);
    } else {
        console.log('No activities to insert.');
    }

  } catch (error) {
    console.error('Error inserting into MongoDB:', error);
  } finally {
    await client.close();
  }
}

main();
