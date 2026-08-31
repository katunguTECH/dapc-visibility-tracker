const { MongoClient } = require('mongodb');
require('dotenv').config();

async function resetLeads() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in environment');
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('leads').deleteMany({});
    
    console.log(`✅ Cleared ${result.deletedCount} leads from database`);
    
    // Optional: Also clear any related collections
    await db.collection('businesses').deleteMany({});
    console.log('✅ Cleared businesses collection');
    
    console.log('✅ Database reset complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

resetLeads();
