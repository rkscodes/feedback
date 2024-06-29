import { Resend } from "resend";
import { VerificationEmail } from "../../emails/verficiationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendVerificationEmail(
	email: string,
	verifcationCode: string,
): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: 'onboarding@feedback.rkscodes.com',
			to: email,
			subject: 'Verification Code',
			react: VerificationEmail({ validationCode: verifcationCode }),
		});
		return { success: true, message: "Verfication email sent successfully" };
	}
	catch (emailError) {
		console.error("Error sending verfication email", emailError)
		return { success: false, message: "Failed to send verified email" }
	}
}