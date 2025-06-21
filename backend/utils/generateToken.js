import jwt from "jsonwebtoken";

const generateToken = (user, expireDate) => {
  return jwt.sign(
    {
      email: user.email,
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: expireDate }
  );
};

export { generateToken };