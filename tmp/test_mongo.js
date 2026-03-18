const mongoose = require('mongoose');
const uri = "mongodb+srv://flyrocketagencyin_db_user:NUO9c7aWTZWBI4qD@cluster0.bupznbc.mongodb.net/codecraft?retryWrites=true&w=majority";

async function testConn() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");
    await mongoose.connection.close();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

testConn();
