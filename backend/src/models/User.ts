import mongoose, { Document, Schema, Types } from 'mongoose';
import { randomUUID } from 'crypto';
import Chat from './chat.js';  // Import the Chat model

// Interface for Chat (if needed separately)
export interface IChat extends Document {
  role: 'user' | 'assistant';
  content: string;
}

// Interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  chats: Types.Array<Types.ObjectId>;  // Array of ObjectIds referencing the Chat model
}

// Define the User schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Chat model
      ref: 'Chat',
    },
  ],
});

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
