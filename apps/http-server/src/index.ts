import { prisma } from '@repo/db/db'

setTimeout(async () => {try {
    await prisma.$connect()
    console.log("Connected to database")
  } catch (err) {
    console.error("Database connection error:", err)
  }
}, 1000)