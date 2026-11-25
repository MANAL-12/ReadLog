
const mongoose = require('mongoose');

// Reuse the MongoDB connection across warm Vercel Function invocations.
const cached =
  global.mongoose ||
  (global.mongoose = {
    connection: null,
    promise: null,
  });

const connectDB = async () => {
  if (cached.connection && mongoose.connection.readyState === 1) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully!');
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('Database connection error:', error.message);
        throw error;
      });
  }

  cached.connection = await cached.promise;

  return cached.connection;
};

module.exports = connectDB;
