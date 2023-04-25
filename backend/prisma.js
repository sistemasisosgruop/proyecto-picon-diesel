import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["query", "info", "warn"] });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ["query", "info", "warn"] });
  }
  prisma = global.prisma;
}

// const prisma = new PrismaClient({ log: ["query", "info", "warn"],  });

export default prisma;
