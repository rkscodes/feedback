import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "Username max be 2 characters")
	.max(50, "Max username could be 50 characters")
// .regex(/^a-zA-Z0-9_+$/, "Username can not contain special character")


export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password must be of length 6" }),
})
