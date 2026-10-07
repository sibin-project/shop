import Product from "../models/Product.js";

export async function listProducts(req, res) {
  const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ products });
}

export async function createProduct(req, res) {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ product });
}

export async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
}

export async function deleteProduct(req, res) {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted" });
}