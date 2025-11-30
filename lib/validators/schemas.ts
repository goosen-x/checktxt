import { z } from 'zod'

export const languageSchema = z.enum(['ru', 'en'])
export const languageOptionSchema = z.enum(['ru', 'en', 'auto'])

export const ltRequestSchema = z.object({
  text: z.string().min(1).max(15000),
  language: languageOptionSchema,
})

export const analyzeCheckSchema = z.enum(['ngrams', 'readability', 'seo', 'style'])

export const analyzeRequestSchema = z.object({
  text: z.string().min(1).max(15000),
  language: languageSchema,
  keywords: z.array(z.string()).optional().default([]),
  checks: z.array(analyzeCheckSchema).min(1),
})

export const plagRequestSchema = z.object({
  text: z.string().min(1).max(15000),
  language: languageSchema,
})

export type LTRequestInput = z.infer<typeof ltRequestSchema>
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>
export type PlagRequestInput = z.infer<typeof plagRequestSchema>
