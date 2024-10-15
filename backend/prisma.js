import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient({ log: ['query', 'info', 'warn'] });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

// import { PrismaClient } from '@prisma/client';

// let prisma;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient({ log: ['query', 'info', 'warn'] });
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient({ log: ['query', 'info', 'warn'] });
//   }
//   prisma = global.prisma;
// }

// // const prisma = new PrismaClient({ log: ["query", "info", "warn"],  });

// export default prisma;
