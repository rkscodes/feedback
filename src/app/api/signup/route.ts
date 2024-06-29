import { sendVerificationEmail } from "@/helpers/resend";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
	await dbConnect()

	try {
		const { username, email, password } = await request.json()
		const existingUserByIsVerfied = await UserModel.findOne({
			username,
			isVerified: true
		})
		if (existingUserByIsVerfied) {
			Response.json(
				{
					status: false,
					message: "This username already exists"
				},
				{
					status: 400
				}
			)
		}

		const existingUserByEmail = await UserModel.findOne({ email })
		let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			if (existingUserByEmail.isVerified) {
				return Response.json({
					success: false,
					message: "User already exists with this email"
				}, {
					status: 400
				})
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
				await existingUserByEmail.save()
				return Response.json({
					success: true,
					message: "User details updated"
				}, {
					status: 200
				})
			}

		} else {
			const hashedPassword = await bcrypt.hash(password, 10)
			const expiryDate = new Date()
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessage: true,
				messages: [],
			});
			await newUser.save();

			const emailResponse = await sendVerificationEmail(email, verifyCode);
			if (!emailResponse.success) {
				return Response.json(
					{
						success: false,
						message: `User created, failed to send email please retry : ${emailResponse['message']}`
					},
					{ status: 500 }
				);

			}
			return Response.json({
				success: true,
				message: "User created, please verify with OTP"
			}, {
				status: 200
			})

		}

	} catch (error) {
		console.log('Error registering user', error)
		return Response.json(
			{
				success: false,
				message: "Error regestering user"
			},
			{
				status: 500
			}
		)
	}
}