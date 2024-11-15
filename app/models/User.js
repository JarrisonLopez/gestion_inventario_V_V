import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'admin'}
});

export default mongoose.models.User || mongoose.model('users', userSchema);

