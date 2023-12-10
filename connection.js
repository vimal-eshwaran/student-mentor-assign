const mongoose=require('mongoose');
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://vimalesh114:Eshwar114@cluster0.yxtfffb.mongodb.net/`);
      console.log(`MongoDB Connected:${conn.connection.host}`);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;