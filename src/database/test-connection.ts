import pool from '../config/database.js';
import { logger } from '../utils/index.js';

async function testConnection() {
  try {
    logger.info('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    logger.info('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    logger.info('✅ Database query successful!');
    logger.info(`Current time: ${result.rows[0].current_time}`);
    logger.info(`PostgreSQL version: ${result.rows[0].postgres_version}`);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      logger.info('✅ Existing tables found:');
      tablesResult.rows.forEach(row => {
        logger.info(`  - ${row.table_name}`);
      });
    } else {
      logger.info('ℹ️  No tables found. You may need to run migrations.');
    }
    
    client.release();
    
    logger.info('🎉 Database connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        logger.error('💡 Make sure your PostgreSQL Docker container is running:');
        logger.error('   docker run --name postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=roomgi -p 5432:5432 -d postgres');
      } else if (error.message.includes('database "roomgi" does not exist')) {
        logger.error('💡 Database "roomgi" does not exist. Create it first:');
        logger.error('   docker exec -it postgres createdb -U postgres roomgi');
      } else if (error.message.includes('authentication failed')) {
        logger.error('💡 Check your database credentials in .env file');
      }
    }
    
    process.exit(1);
  }
}

testConnection();