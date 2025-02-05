// importa variáveis de ambiente
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
// carrega as var. ambiente ANTES do teste pegar o ConfigModule do app.module.ts
// ao criar a instancia de app de teste
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { envSchema } from '@/infra/env/env'
import { DomainEvents } from '@/core/events/domain-events'
import Redis from 'ioredis'

// carrega as vars do .env:
config({ path: '.env', override: true })
// carrega novo arquivo e, se tiver var com mesmo nome, atualiza para o valor
// da var desse arquivo:
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

function generateUniqueDatabaseURL(schemaId: string) {
  // evita que haja DATABASE_URL vazia ou inexistente
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  // cria nova URL
  const url = new URL(env.DATABASE_URL)

  // insere o id para criar um novo schema dentro do banco postgres
  url.searchParams.set('schema', schemaId)

  // retorna a url
  return url.toString()
}

const schemaId = randomUUID()

// antes de uma suíte de testes, cria o banco
// se você quer criar um banco antes de CADA teste: beforeEach()
beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  // sobrescreve var ambiente DATABASE_URL com a nova databaseURL gerada
  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  // deleta todos os dados do banco redis de cache
  await redis.flushdb()

  // roda apenas as migrações sem verificar alterações de schema
  const result = execSync('npx prisma migrate deploy')

  console.log(result.toString())
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)

  await prisma.$disconnect()
})
