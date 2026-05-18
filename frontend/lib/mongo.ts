import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || process.env.NEXT_PUBLIC_MONGO_URL;

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env');
}

/**
 * Use a global cached connection to avoid exhausting connections during hot reloads in dev.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose || { conn: null, promise: null };

if (!cached.promise) {
  const opts = {
    dbName: 'chatbot',
    // useNewUrlParser: true, // modern mongoose defaults
  };
  cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoosePkg) => {
    return mongoosePkg;
  });
}

export async function connect() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise!;
  (global as any).mongoose = cached;
  return cached.conn;
}
