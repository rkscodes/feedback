import { sendVerificationEmail } from "@/helpers/resend";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function POST(request: Request) {
	await dbConnect()
	try {
		const { email } = await request.json();

		const user = await UserModel.findOne({
			email
		})

		if (!user) {
			return Response.json({
				success: false,
				message: "Email ID not valid"
			}, {
				status: 404
			})
		}
		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
		const verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000)
		user.verifyCode = verificationCode
		user.verifyCodeExpiry = verificationCodeExpiry
		await user.save()

		const emailStatus = await sendVerificationEmail(email, verificationCode);
		if (!emailStatus.success) {
			return Response.json(
				{
					success: false,
					message: `Failed to send email please retry : ${emailStatus['message']}`
				},
				{ status: 500 }
			);

		}
		return Response.json({
			success: true,
			message: "Email sent successfully"
		}, {
			status: 200
		})
	} catch (error) {
		return Response.json({
			success: false,
			message: "Error generating verification code"
		}, {
			status: 500
		})
	}
}