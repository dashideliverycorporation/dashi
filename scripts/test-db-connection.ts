import { PrismaClient } from '../prisma/app/generated/prisma/client';

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Attempting to connect to the database...');
    
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    console.log('Connection successful!', result);
    
    // Get database version
    const versionResult = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', versionResult);
    
    // List all tables in the database
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Tables in database:');
    console.log(tables);
    
  } catch (error) {
    console.error('Failed to connect to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();