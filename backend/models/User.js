const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null }
}, {
    timestamps: true // automatically adds createdAt and updatedAt fields
});

// Hash the password before saving it to the database
// This is a middleware function that runs before the document is saved
// In this case, this refers to the current user document instance.
// This is how mongoose works. We treat each document as an instance
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare the hashed password with the provided password
// Creating custom methods to compare the passwords
// In this case, this refers to the current user document instance.
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);