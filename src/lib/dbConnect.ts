import { error } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log('Database already connected');
		return;
	}
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || '')
		connection.isConnected = db.connections[0].readyState
		console.log("DB connected successfully")
	}
	catch {
		console.log("DB connection failed", error)
	}

}

export default dbConnect; 