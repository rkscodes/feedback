import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";


export async function POST(request: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions)
	const user: User = session?.user as User
	if (!session || !session.user) {
		return Response.json({
			success: false,
			message: "Not authenticated"
		}, {
			status: 401
		})
	}

	const userId = user._id
	const { acceptMessages } = await request.json()
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })

		if (!updatedUser) {
			return Response.json({
				success: false,
				message: "Failed to find and update is accepting msg by user id"
			}, {
				status: 401
			})
		}
		return Response.json({
			success: true,
			message: `Accepting message status changed to ${acceptMessages}`
		}, {
			status: 200
		})

	} catch (error) {
		return Response.json({
			success: false,
			message: "Failed to change isAcceptingMessages"
		}, {
			status: 500
		})
	}

}

export async function GET(request: Request) {
	await dbConnect();
	const session = await getServerSession(authOptions)
	const user: User = session?.user as User
	if (!session || !session.user) {
		return Response.json({
			success: false,
			message: "Not authenticated"
		}, {
			status: 401
		})
	}

	const userId = user._id

	try {
		const validUser = await UserModel.findById(userId);
		if (!validUser) {
			return Response.json({
				success: false,
				message: "User not found"
			}, {
				status: 404
			})
		}

		return Response.json({
			success: true,
			isAcceptingMessages: validUser.isAcceptingMessage,
		}, {
			status: 200
		})
	} catch (error) {
		return Response.json({
			success: false,
			message: "Couldn't find user by userID"
		}, {
			status: 404
		})
	}
}