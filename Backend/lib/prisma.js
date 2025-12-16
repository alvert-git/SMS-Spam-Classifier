// lib/prisma.js

require('dotenv/config'); 
const { PrismaPg } = require('@prisma/adapter-pg');

// *** THIS IS THE CORRECTED LINE ***
// Path from lib/prisma.js to Backend/generated/prisma
const { PrismaClient } = require('../generated/prisma'); 

// ... rest of your singleton code ...

const globalForPrisma = global;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const adapter = new PrismaPg(connectionString);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
