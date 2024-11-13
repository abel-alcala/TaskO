import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userID: {
        type: String, required: true, unique: true,
    }, email: {
        type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Use a valid email address'],
    }, firstName: {
        type: String, required: true,
    }, lastName: {
        type: String, required: true,
    }, password: {
        type: String, required: true,
    }, lists: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'List',
    }],
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
