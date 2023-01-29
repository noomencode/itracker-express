import jwt from "jsonwebtoken";

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    domain: ".onrender.com",
    //7 days expiry
    expires: new Date(Date.now() + 7 * 24 * 3600000),
  });
};

export default generateToken;
