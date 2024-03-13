import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    github: {
        id: String,
        token: String,
        username: String,
    }
});

const User = mongoose.model('User', userSchema);
export default User