const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB Connected...');
    } catch(err){
        console.log("Error Connecting to MongoDB", err);
        process.exit(1); // terminating the process with 1 as exit code. 1 (any non-zero) exit code means error and 0 means success
    }
}

module.exports = connectDB;