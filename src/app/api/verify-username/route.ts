import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schema/signup.schema";
import { z } from 'zod'

const usernameQuerySchema = z.object({
	username: usernameValidation
})

export async function GET(request: Request) {
	await dbConnect();
	try {
		const { searchParams } = new URL(request.url)
		const queryParam = {
			username: searchParams.get('username')
		}
		const result = usernameQuerySchema.safeParse(queryParam)
		if (!result.success) {
			const usernameError = result.error.format().username?._errors || []
			return Response.json({
				sucess: false,
				message: usernameError.length > 0 ? usernameError.join(', ') : "Invalid query params"
			}, {
				status: 400
			})
		}
		const { username } = result.data

		const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
		if (existingVerifiedUser) {
			return Response.json({
				sucess: false,
				message: "Username is already taken"
			}, {
				status: 400
			})
		} else {
			return Response.json({
				success: true,
				message: "Username available"
			}, {
				status: 200
			})
		}
	}
	catch (error) {
		console.error("Error checking username: ", error)
		Response.json(
			{
				sucess: false,
				message: "Error checking username"
			},
			{
				status: 500
			}
		)
	}
}