import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { DomainEvents } from '@/core/events/domain-events'

config({ path: '.env', override: true })
config({ path: '.env.test.local', override: true })

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  DomainEvents.shouldRun = false
  execSync('pnpm prisma migrate deploy')
})

const prisma = new PrismaClient()

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
