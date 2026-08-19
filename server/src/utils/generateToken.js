// This function generates a JSON Web Token (JWT) for a given user ID. The token is signed using a secret key stored in the environment variable `JWT_SECRET` and is set to expire in 7 days. The generated token
// utils are made as helper functions to be used in other parts of the application, such as authentication middleware or user login processes.


import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;