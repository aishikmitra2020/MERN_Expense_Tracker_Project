const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // Here, this "User" refers to the model name (collection name) we have created in User.js file. i.e., "User
        ref: "User",
        required:true
    },
    icon: { type: String },
    source: { type: String, required: true }, // Example: Salary, Freelance etc.
    amount: { type: Number, required: true },
    date: { type: Date, default:Date.now },
}, { timestamps: true });


module.exports = mongoose.model("Income", IncomeSchema);