import mongoose, { Schema } from 'mongoose';
// Define the User schema
const userSchema = new Schema({
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
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=User.js.map