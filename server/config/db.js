const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // No need for deprecated options in newer mongoose versions
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    // Don't exit process here, let the calling code handle it
    throw error;
  }
};

module.exports = connectDB; 