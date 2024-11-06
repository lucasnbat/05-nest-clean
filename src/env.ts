import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET: z.string(),
})

export type EnvType = z.infer<typeof envSchema>
