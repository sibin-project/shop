export function validate(schema) {
  return (req, res, next) => {
    const errors = schema.safeParse(req.body);
    if (!errors.success) {
      return res.status(400).json({
        message: errors.error.issues[0].message,
        issues: errors.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    req.body = errors.data;
    next();
  };
}
