import mongoose, { Schema } from 'mongoose';
// Define the Chat schema
const chatSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'], // Only allows 'user' or 'assistant' values for role
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
const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
//# sourceMappingURL=chat.js.map