import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
})

export interface User extends Document {
	username: string;
	password: string;
	email: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingMessage: boolean;
	messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, 'Please give valid mail address']
	},
	verifyCode: {
		type: String,
		required: [true, "Verification is required"],
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verification Expiry time is needed"],
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	messages: [MessageSchema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>)
	|| (mongoose.model<User>("User", UserSchema))


export default UserModel