import { sendVerificationEmail } from "@/helpers/resend";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from 'zod';

export async function POST(request: Request) {
	await dbConnect()

	try {
		const { userid, verificationCode } = await request.json();
		const decodedUsername = decodeURIComponent(userid);

		const user = await UserModel.findOne({
			$or: [{
				username: userid
			}, {
				email: userid
			}]
		})

		if (!user) {
			return Response.json({
				success: false,
				message: "User not found"
			}, {
				status: 404
			})
		}
		if (user.isVerified) {
			return Response.json({
				success: false,
				message: "User already verified"
			},
				{
					status: 400
				}
			)
		}
		const verificationCodeMatch = verificationCode == user.verifyCode
		const verificationCodeNotExpired = user.verifyCodeExpiry.getTime() >= Date.now()
		if (!verificationCodeMatch) {
			return Response.json({
				success: false,
				message: "Verfication code doesn't match"
			}, {
				status: 401
			})
		}
		if (!verificationCodeNotExpired) {
			return Response.json({
				success: false,
				message: "Verfication code expired"
			}, {
				status: 498
			})
		}

		user.isVerified = true


		await user.save()
		return Response.json({
			success: true,
			message: "User is verified"
		}, {
			status: 200
		})

	} catch (error) {
		return Response.json({
			success: false,
			message: "Error verfiying user"
		}, {
			status: 500
		})
	}
}