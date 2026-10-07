import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please provide a valid email")
  .max(254, "Email must be at most 254 characters");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

const title = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(120, "Title must be at most 120 characters");

const image = z
  .string()
  .trim()
  .max(2048, "Image URL must be at most 2048 characters")
  .refine(
    (v) => v === "" || /^https?:\/\/\S+$/i.test(v),
    "Image must be a valid http(s) URL"
  )
  .default("");

const price = z.coerce
  .number({ message: "Price must be a number" })
  .min(0, "Price cannot be negative")
  .max(1_000_000, "Price is unrealistically large");

const description = z
  .string()
  .trim()
  .min(2, "Description must be at least 2 characters")
  .max(1000, "Description must be at most 1000 characters");

export const createProductSchema = z.object({
  title,
  image,
  price,
  description,
});

export const updateProductSchema = createProductSchema.partial();
