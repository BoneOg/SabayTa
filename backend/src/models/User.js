import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;