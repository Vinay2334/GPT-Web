import mongoose, { Schema, Document } from 'mongoose';

// Interface for Chat
export interface IChat extends Document {
  role: 'user' | 'assistant'; // Role of the participant (user or assistant)
  content: string;           // The content of the chat message
}

// Define the Chat schema
const chatSchema: Schema<IChat> = new Schema<IChat>({
  role: { 
    type: String, 
    enum: ['user', 'assistant'],  // Only allows 'user' or 'assistant' values for role
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the Chat model
const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
