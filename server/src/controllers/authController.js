import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const REFRESH_TOKEN_TTL = "30d";

function signAccess(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

function signRefresh(user) {
  return jwt.sign(
    { sub: user._id.toString(), type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

function sanitize(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "An account with that email already exists" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    user: sanitize(user),
    token: signAccess(user),
    refreshToken: signRefresh(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const ok = user && (await bcrypt.compare(password, user.password));

  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    user: sanitize(user),
    token: signAccess(user),
    refreshToken: signRefresh(user),
  });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.type !== "refresh") throw new Error("bad type");

    const user = await User.findById(payload.sub);
    if (!user) throw new Error("no user");

    res.json({ token: signAccess(user), user: sanitize(user) });
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function me(req, res) {
  res.json({ user: sanitize(req.user) });
}
