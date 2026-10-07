import mongoose from "mongoose";

const PLACEHOLDER_USERNAMES = new Set([
  "user",
  "username",
  "db_username",
  "change_me",
  "xxxx",
  "your_username",
]);

function parseCredentials(uri) {
  const m = /^mongodb\+srv:\/\/([^:@/]+):([^@]*)@(.+)$/.exec(uri);
  if (!m) return null;
  return { username: m[1], password: m[2], host: m[3] };
}

function findPlaceholder(uri) {
  const creds = parseCredentials(uri);
  if (!creds) return "the connection string is not a valid mongodb+srv:// URI";

  if (/[<>]/.test(uri)) return "it still contains <angle bracket> placeholders";
  if (PLACEHOLDER_USERNAMES.has(creds.username.toLowerCase()))
    return `the username "${creds.username}" is a placeholder`;
  if (!creds.password || creds.password.toLowerCase() === "password")
    return "the password is a placeholder";

  return null;
}

function describeMongoError(err) {
  const msg = String(err?.message || err);

  if (err?.name === "MongooseServerSelectionError" || /Server selection timed out/i.test(msg)) {
    return (
      "Timed out reaching the cluster. Your IP is probably not in the Atlas " +
      "Network Access list - add 0.0.0.0/0 (or your current IP) under Network Access."
    );
  }

  if (/bad auth|Authentication failed/i.test(msg)) {
    return "Atlas rejected the username or password in MONGO_URI.";
  }

  return msg;
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set. Add your Atlas connection string to server/.env");
  }

  const placeholder = findPlaceholder(uri);
  if (placeholder) {
    throw new Error(
      `MONGO_URI is not ready: ${placeholder}. ` +
        "Paste a real Atlas connection string into server/.env."
    );
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`MongoDB (Atlas) connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    throw new Error(describeMongoError(err));
  }
}