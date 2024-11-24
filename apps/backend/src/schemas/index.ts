import { z } from 'zod'

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    password: z.string().min(6),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
})

export const DocumentSchema = z.object({
    id: z.number(),
    title: z.string().min(1),
    content: z.string(),
    userId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const RegisterSchema = LoginSchema.extend({
    passwordConfirmation: z.string().min(6)
})

export const CreateDocumentSchema = z.object({
    title: z.string().min(1),
    content: z.string()
})

export const UpdateDocumentSchema = CreateDocumentSchema.partial()