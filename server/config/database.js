const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
 mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("MongoDB connected successfully");
 }).catch((error) => {
    console.log("Issue in Db connection");
        console.log(error.message);
        process.exit(1);
 });
};
 module.exports = connectDB;