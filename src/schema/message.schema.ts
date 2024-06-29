import { z } from "zod";


export const messageSchema = z.object({
	content: z.string().max(1000, "Max 1000 chars allowed"),
	createdAt: z.date()
})