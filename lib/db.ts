import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

async function dbConnect() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  const cached =
    globalWithMongoose.mongoose ??
    (globalWithMongoose.mongoose = { conn: null, promise: null });

  if (!mongoUri) {
    throw new Error(
      'Missing MongoDB connection string. Set MONGODB_URI in Vercel (or MONGODB_URL for backward compatibility).',
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
