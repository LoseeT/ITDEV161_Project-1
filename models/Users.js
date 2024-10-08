import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    player: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: String,  // Change this to String if you want to store "5/15"
        required: true
    }
});

const User = mongoose.model('user', UserSchema);

export default User;