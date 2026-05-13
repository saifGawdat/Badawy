const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const fields = Object.keys(prisma.location.fields || {});
    console.log('Location fields:', fields);
    if (fields.includes('slug')) {
      console.log('SUCCESS: slug field found in Prisma Client');
    } else {
      console.log('FAILURE: slug field NOT found in Prisma Client');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
