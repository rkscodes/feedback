import { z } from "zod"


export const verificationCodeSchema = z.object({
	code: z.string().length(6, "Should be of 6 characters")
})