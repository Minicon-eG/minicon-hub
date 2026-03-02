
import { MongoClient } from 'mongodb';

const DATABASE_URL = 'mongodb://localhost:27018/minicon-hub';

async function main() {
  const client = new MongoClient(DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('AgentActivity');

    const count = await collection.countDocuments();
    console.log(`Total AgentActivity count: ${count}`);

    const entries = await collection.find({}).limit(3).toArray();
    console.log('Sample entries:', entries);

  } catch (error) {
    console.error('Error verifying MongoDB:', error);
  } finally {
    await client.close();
  }
}

main();
